const path = require('path');
const { expect } = require('chai');
const {
  RPCWorkersPool,
} = require('../index');

const WORKER_PATH = path.resolve(__dirname, './rpc-worker.js');

describe('RPCWorkersPool', () => {
  const workersPool = new RPCWorkersPool({
    min: 2,
    max: 6,
  }, WORKER_PATH);

  before(async () => {
    // warming up
    const promises = [...Array(6)].map(() => workersPool
      .send({
        name: 'sum',
        data: [1, 1],
      }));

    await Promise.all(promises);
  });

  after(() => {
    workersPool.close();
  });

  it('should call sum on threads pool', async () => {
    const promises = [...Array(10)].map((_, idx) => workersPool
      .send({
        name: 'sum',
        data: [1, 2, 3, 4, 5, 6, idx],
      }));

    const totalSum = (await Promise.all(promises)).reduce((acc, val) => acc + val);

    expect(totalSum).to.equals(255);
  });
});
