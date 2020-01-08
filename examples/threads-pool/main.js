const { RPCWorker } = require('rpc-worker-threads');
const genericPool = require('generic-pool');

const factory = {
  create() {
    return new RPCWorker(`${__dirname}/worker.js`).init();
  },
  destroy(thread) {
    return thread.terminate();
  },
};

const opts = {
  min: 2,
  max: 4,
};

const rpcThreadsPool = genericPool.createPool(factory, opts);

const promises = [];

for (let i = 0; i < 10; i += 1) {
  const promise = rpcThreadsPool
    .acquire()
    .then(async (worker) => {
      const result = await worker.send('hello');

      rpcThreadsPool.release(worker);

      return result;
    });

  promises.push(promise);
}

Promise
  .all(promises)
  .then((results) => {
    console.log(results);
  })
  .then(() => rpcThreadsPool.drain())
  .then(() => rpcThreadsPool.clear());
