# !IMPORTANT. Lib is not ready to production or development use.

# rpc-worker-threads

# How to use

```javascript
const { isMainThread } = require('worker_threads');

if (isMainThread) {
  const { RPCWorker } = require('rpc-worker-threads');

  async function init() {
    const rpcWorker = new RPCWorker(__filename);
    await rpcWorker.init();

    const result = await rpcWorker.send('myFn', 'World');

    console.log(result); // Hello World!
  }

  init();
} else {
  const { RPCWorker } = global;

  RPCWorker.addHandler('myFn', (v) => {
    return `Hello ${v}!`;
  });
}
```

# API

## RPCWorker(filename: string, options?: WorkerOptions | undefined) extends Worker

### RPCWorker.send(opts): Promise<any>
* opts.name - remote method name
* opts.data [optional] - payload
* opts.transferList - transfer list. [More in the node docs](https://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist)
* opts.executionTimeout [optional] - execution timeout

### RPCWorker.setDefaultExecutionTimeout(timeout: number)

## RPC
### PRC.addHandler(fnName: string, callback: Function)

## RPCWorkersPool(poolOpts, filename: string, options?: WorkerOptions | undefined)

### RPCWorkersPool.send(opts): Promise<any>
* opts.name - remote method name
* opts.data [optional] - payload
* opts.transferList - transfer list. [More in the node docs](https://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist)
* opts.executionTimeout [optional] - execution timeout

### RPCWorkersPool.close(): Promise<void>

# Custom pooling example

Look example [here](https://github.com/ArturAralin/rpc-worker-threads/tree/master/examples/threads-pool)
