import { RPCWorker } from './rpc';

(async () => {
  const worker = new RPCWorker('some file');

  await worker.init();

  const r = await worker.send('test_task', { a: 10, b: 20 });

  console.log('finished', r);
})()
