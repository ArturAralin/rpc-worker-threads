"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("./rpc");
(async () => {
    const worker = new rpc_1.RPCWorker('some file');
    await worker.init();
    const r = await worker.send('test_task', { a: 10, b: 20 });
    console.log('finished', r);
})();
