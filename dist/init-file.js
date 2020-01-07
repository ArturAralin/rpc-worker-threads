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
                    name,
                    status: 'not_found',
                    taskId,
                });
                return;
            }
            try {
                const response = await handler(req.data);
                msgPort.postMessage({
                    name,
                    response,
                    status: 'success',
                    taskId,
                });
            }
            catch (err) {
                msgPort.postMessage({
                    name,
                    response: err,
                    status: 'error',
                    taskId,
                });
            }
        });
    }
    addHandler(name, cb) {
        this.handlers[name] = cb;
    }
}
exports.RPC = RPC;
if (worker_threads_1.parentPort) {
    worker_threads_1.parentPort.on('message', ({ channel, pathToFile, }) => {
        if (worker_threads_1.parentPort) {
            global.RPCWorker = new RPC(channel);
            worker_threads_1.parentPort.postMessage('ready');
            require(pathToFile);
        }
    });
}
//# sourceMappingURL=init-file.js.map