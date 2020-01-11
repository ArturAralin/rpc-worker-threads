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

### RPCWorker.send(fnName: string, data?: any, transferList?: Array<ArrayBuffer | MessagePort>)

### PRC.addHandler(fnName: string, callback: Function)

# Pooling example

Look example [here](https://github.com/ArturAralin/rpc-worker-threads/tree/master/examples/threads-pool)
