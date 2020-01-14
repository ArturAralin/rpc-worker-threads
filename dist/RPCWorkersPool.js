"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_pool_1 = require("generic-pool");
const RPCWorker_1 = require("./RPCWorker");
class RPCWorkersPool {
    constructor(poolOpts, filename, options) {
        this.pool = generic_pool_1.createPool({
            create() {
                return new RPCWorker_1.RPCWorker(filename, options).init();
            },
            async destroy(worker) {
                worker.terminate();
            },
        }, poolOpts);
    }
    async send(opts) {
        const worker = await this.pool.acquire();
        let result;
        try {
            result = await worker.send(opts);
        }
        finally {
            this.pool.release(worker);
        }
        return result;
    }
    async close() {
        await this.pool.drain();
        await this.pool.clear();
    }
}
exports.RPCWorkersPool = RPCWorkersPool;
exports.default = RPCWorkersPool;
