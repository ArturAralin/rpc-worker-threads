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

# Pooling example

Look example [here](tree/master/examples/threads-pool)
