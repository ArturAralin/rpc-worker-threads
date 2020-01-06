"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
class RPC {
    constructor(msgPort) {
        this.handlers = {};
        msgPort.on('message', async (req) => {
            const { taskId, name } = req;
            const handler = this.handlers[req.name];
            if (!handler) {
                msgPort.postMessage({
                    status: 'not_found',
                    taskId,
                    name,
                });
                return;
            }
            try {
                const response = await handler(req.data);
                msgPort.postMessage({
                    status: 'success',
                    taskId,
                    name,
                    response,
                });
            }
            catch (err) {
                msgPort.postMessage({
                    status: 'error',
                    taskId,
                    name,
                    response: err,
                });
            }
        });
    }
    addHandler(name, cb) {
        this.handlers[name] = cb;
    }
}
if (worker_threads_1.parentPort) {
    worker_threads_1.parentPort.on('message', (channel) => {
        if (worker_threads_1.parentPort) {
            const r = new RPC(channel);
            r.addHandler('test_task', (r) => {
                console.log('test_task ready');
                return 'ok';
            });
            worker_threads_1.parentPort.postMessage('ready');
        }
    });
}
