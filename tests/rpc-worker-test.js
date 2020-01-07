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

  it('should be successfully finished', async () => {
    const result = await rpcWorker.send('sum', [1, 2, 3, 4]);

    expect(result).to.equals(10);
  });

  it('should return a error', async () => {
    const result = await rpcWorker.send('throw_error').catch((err) => err);

    expect(result.status).to.equals('error');
  });

  it('should return not-found error', async () => {
    const result = await rpcWorker.send('unknown').catch((err) => err);

    expect(result.status).to.equals('not_found');
  });
});
