import {
  parentPort,
  MessagePort,
} from 'worker_threads';
import {
  RPCRequest,
  RPCResponse,
} from './interfaces';
import { ok } from 'assert';

type CallbackFn = (v?: any) => any;

class RPC {
  private handlers: { [k: string]: CallbackFn } = {};

  constructor(msgPort: MessagePort) {
    msgPort.on('message', async (req: RPCRequest) => {
      const { taskId, name } = req;
      const handler = this.handlers[req.name];

      if (!handler) {
        msgPort.postMessage({
          status: 'not_found',
          taskId,
          name,
        } as RPCResponse);

        return;
      }

      try {
        const response = await handler(req.data);

        msgPort.postMessage({
          status: 'success',
          taskId,
          name,
          response,
        } as RPCResponse);
      } catch (err) {
        msgPort.postMessage({
          status: 'error',
          taskId,
          name,
          response: err,
        } as RPCResponse);
      }
    })
  }

  addHandler(name: string, cb: CallbackFn) {
    this.handlers[name] = cb;
  }
}

if (parentPort) {
  parentPort.on('message', (channel: MessagePort) => {
    if (parentPort) {
      const r = new RPC(channel);

      r.addHandler('test_task', (r) => {
        console.log('test_task ready');

        return 'ok';
      });

      parentPort.postMessage('ready');
    }
  });
}
