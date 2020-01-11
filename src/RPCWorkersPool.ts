import {
  createPool,
  Options as PoolOptions,
  Pool,
} from 'generic-pool';
import {
  WorkerOptions,
} from 'worker_threads';

import {
  ISendOpts,
  RPCWorker,
} from './RPCWorker';

export class RPCWorkersPool {
  public pool!: Pool<RPCWorker>;

  constructor(poolOpts: PoolOptions, filename: string, options?: WorkerOptions | undefined) {
    this.pool = createPool<RPCWorker>({
      create() {
        return new RPCWorker(filename, options).init();
      },
      async destroy(worker) {
        worker.terminate();
      },
    }, poolOpts);
  }

  public async send(opts: ISendOpts) {
    const worker = await this.pool.acquire();
    let result;

    try {
      result = await worker.send(opts);
    } finally {
      this.pool.release(worker);
    }

    return result;
  }

  public async close() {
    await this.pool.drain();
    await this.pool.clear();
  }
}

export default RPCWorkersPool;
