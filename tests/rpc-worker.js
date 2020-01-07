const { RPCWorker } = global;

RPCWorker.addHandler('sum', (arr) => {
  const sum = (acc, val) => acc + val;

  return arr.reduce(sum, 0);
});

RPCWorker.addHandler('throw_error', () => {
  throw new Error('fail');
});
