import { ok } from 'assert';
import {
  MessagePort,
  parentPort,
} from 'worker_threads';
import {
  IRPCRequest,
  IRPCResponse,
} from './interfaces';

type CallbackFn = (v?: any) => any;

export class RPC {
  private handlers: { [k: string]: CallbackFn } = {};

  constructor(msgPort: MessagePort) {
    msgPort.on('message', async (req: IRPCRequest) => {
      const { taskId, name } = req;
      const handler = this.handlers[req.name];

      if (!handler) {
        msgPort.postMessage({
          name,
          status: 'not_found',
          taskId,
        } as IRPCResponse);

        return;
      }

      try {
        const response = await handler(req.data);

        msgPort.postMessage({
          name,
          response,
          status: 'success',
          taskId,
        } as IRPCResponse);
      } catch (err) {
        msgPort.postMessage({
          name,
          response: err,
          status: 'error',
          taskId,
        } as IRPCResponse);
      }
    });
  }

  public addHandler(name: string, cb: CallbackFn) {
    this.handlers[name] = cb;
  }
}

if (parentPort) {
  parentPort.on('message', ({
    channel,
    pathToFile,
  }) => {
    if (parentPort) {
      global.RPCWorker = new RPC(channel);

      parentPort.postMessage('ready');
      require(pathToFile);
    }
  });
}
