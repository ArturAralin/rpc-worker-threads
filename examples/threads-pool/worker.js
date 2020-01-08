const { threadId } = require('worker_threads');

const { RPCWorker } = global;

RPCWorker.addHandler('hello', () => {
  return `Hello from worker "${threadId}"!`;
});
