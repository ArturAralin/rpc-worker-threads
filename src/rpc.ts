import {
  Worker,
  WorkerOptions,
  MessageChannel,
  MessagePort,
} from 'worker_threads';
import * as path from 'path';
import { v4 as genUUID } from 'uuid';
import {
  RPCRequest,
  RPCResponse,
} from './interfaces';

const WORKER_INIT_FILE = path.resolve(__dirname, './init-file.js');

interface TaskFNs {
  resolve: (v: any) => void;
  reject: (v: any) => void;
}

export class RPCWorker extends Worker {
  private started = false;
  private msgPort!: MessagePort;
  private tasks: Map<string, TaskFNs> = new Map();

  constructor(filename: string, options?: WorkerOptions | undefined) {
    super(WORKER_INIT_FILE, options);
  }

  private responseHandler(res: RPCResponse) {
    const task = this.tasks.get(res.taskId);

    if (!task) {
      throw new Error(`Unknown task id ${res.taskId}`);
    }

    if (res.status === 'success') {
      task.resolve(res.response);

      return;
    }

    task.reject({
      status: res.status,
      response: res.response,
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      const { port1, port2 } = new MessageChannel();

      this.msgPort = port2;

      this.once('message', (msg) => {
        if (msg === 'ready') {
          this.started = true;
          this.msgPort.on('message', this.responseHandler.bind(this));

          resolve();

          return;
        }

        reject();
      });

      this.postMessage(port1, [port1]);
    });
  }

  send(name: string, data?: any) {
    if (!this.started) {
      throw new Error('RPC Worker is not started');
    }

    const taskId = genUUID();

    return new Promise((resolve, reject) => {
      this.tasks.set(taskId, { resolve, reject });

      this.msgPort.postMessage({
        taskId,
        name,
        data,
      } as RPCRequest);
    });
  }
}
