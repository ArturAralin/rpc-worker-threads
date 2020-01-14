const path = require('path');
const { expect } = require('chai');
const {
  RPCWorker,
} = require('../index');

const WORKER_PATH = path.resolve(__dirname, './rpc-worker.js');

describe('RPCWorker', () => {
  let rpcWorker = null;

  before(async () => {
    rpcWorker = new RPCWorker(WORKER_PATH);
    await rpcWorker.init();
  });

  after(() => {
    rpcWorker.terminate();
  });

  it('should automatically init worker on first call send method', async () => {
    const worker = new RPCWorker(WORKER_PATH);
    const result = await worker.send({
      name: 'sum',
      data: [1, 2, 3],
    });

    worker.terminate();

    expect(result).to.equals(6);
  });

  it('should be successfully finished', async () => {
    const result = await rpcWorker.send({
      name: 'sum',
      data: [1, 2, 3, 4],
    });

    expect(result).to.equals(10);
  });

  it('should return a error', async () => {
    const result = await rpcWorker.send({
      name: 'throw_error',
    }).catch((err) => err);

    expect(result.status).to.equals('error');
  });

  it('should return not-found error', async () => {
    const result = await rpcWorker.send({
      name: 'unknown',
    }).catch((err) => err);

    expect(result.status).to.equals('not_found');
  });

  it('should return timeout exceeded', async () => {
    const result = await rpcWorker.send({
      name: 'long_task',
      executionTimeout: 20,
    }).catch((err) => err);


    expect(result.status).to.equals('timeout');
  });
});
