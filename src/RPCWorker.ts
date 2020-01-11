import * as path from 'path';
import { v4 as genUUID } from 'uuid';
import {
  MessageChannel,
  MessagePort,
  Worker,
  WorkerOptions,
} from 'worker_threads';
import {
  IRPCRequest,
  IRPCResponse,
} from './interfaces';

const WORKER_INIT_FILE = path.resolve(__dirname, './init-file.js');

interface ITaskFNs {
  resolve: (v: any) => void;
  reject: (v: any) => void;
}

export interface ISendOpts {
  name: string;
  data?: any;
  transferList?: Array<ArrayBuffer | MessagePort>;
  executionTimeout?: number;
}

export class RPCWorker extends Worker {
  private started = false;

  private msgPort!: MessagePort;

  private tasks: Map<string, ITaskFNs> = new Map();

  private targetFile: string = '';

  private defaultExecutionTimeout: number = 3000;

  constructor(filename: string, options?: WorkerOptions | undefined) {
    super(WORKER_INIT_FILE, options);
    this.targetFile = filename;
  }

  public init(): Promise<RPCWorker> {
    return new Promise((resolve, reject) => {
      const { port1, port2 } = new MessageChannel();

      this.msgPort = port2;

      this.once('message', (msg) => {
        if (msg === 'ready') {
          this.started = true;
          this.msgPort.on('message', this.responseHandler.bind(this));

          resolve(this);

          return;
        }

        reject();
      });

      this.postMessage({
        channel: port1,
        pathToFile: this.targetFile,
      }, [port1]);
    });
  }

  public send({
    name,
    data,
    transferList,
    executionTimeout,
  }: ISendOpts) {
    if (!this.started) {
      throw new Error('RPC Worker is not started');
    }

    const taskId = genUUID();
    const timeout = executionTimeout || this.defaultExecutionTimeout;

    return new Promise((resolve, reject) => {
      this.tasks.set(taskId, { resolve, reject });

      setTimeout(() => {
        reject({
          response: new Error(`Task exceeded timeout`),
          status: 'timeout',
        });

        this.tasks.delete(taskId);
      }, timeout);

      this.msgPort.postMessage({
        data,
        name,
        taskId,
      } as IRPCRequest, transferList);
    });
  }

  public setDefaultExecutionTimeout(timeout: number) {
    this.defaultExecutionTimeout = timeout;
  }

  private responseHandler(res: IRPCResponse) {
    const task = this.tasks.get(res.taskId);

    if (!task) {
      return;
    }

    this.tasks.delete(res.taskId);

    if (res.status === 'success') {
      task.resolve(res.response);

      return;
    }

    task.reject({
      response: res.response,
      status: res.status,
    });
  }
}

export default RPCWorker;
