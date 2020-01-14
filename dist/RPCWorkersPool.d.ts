/// <reference types="node" />
import { Options as PoolOptions, Pool } from 'generic-pool';
import { WorkerOptions } from 'worker_threads';
import { ISendOpts, RPCWorker } from './RPCWorker';
export declare class RPCWorkersPool {
    pool: Pool<RPCWorker>;
    constructor(poolOpts: PoolOptions, filename: string, options?: WorkerOptions | undefined);
    send(opts: ISendOpts): Promise<unknown>;
    close(): Promise<void>;
}
export default RPCWorkersPool;
//# sourceMappingURL=RPCWorkersPool.d.ts.map