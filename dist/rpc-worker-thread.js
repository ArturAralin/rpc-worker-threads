"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const worker_threads_1 = require("worker_threads");
const WORKER_INIT_FILE = path.resolve(__dirname, './init-file.js');
class RPCWorker extends worker_threads_1.Worker {
    constructor(filename, options) {
        super(WORKER_INIT_FILE, options);
        this.started = false;
        this.tasks = new Map();
        this.targetFile = '';
        this.targetFile = filename;
    }
    init() {
        return new Promise((resolve, reject) => {
            const { port1, port2 } = new worker_threads_1.MessageChannel();
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
            this.postMessage({
                channel: port1,
                pathToFile: this.targetFile,
            }, [port1]);
        });
    }
    send(name, data) {
        if (!this.started) {
            throw new Error('RPC Worker is not started');
        }
        const taskId = uuid_1.v4();
        return new Promise((resolve, reject) => {
            this.tasks.set(taskId, { resolve, reject });
            this.msgPort.postMessage({
                data,
                name,
                taskId,
            });
        });
    }
    responseHandler(res) {
        const task = this.tasks.get(res.taskId);
        if (!task) {
            throw new Error(`Unknown task id ${res.taskId}`);
        }
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
exports.RPCWorker = RPCWorker;
exports.default = RPCWorker;
//# sourceMappingURL=rpc-worker-thread.js.map