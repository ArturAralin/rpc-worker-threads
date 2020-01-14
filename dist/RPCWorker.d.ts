/// <reference types="node" />
import { MessagePort, Worker, WorkerOptions } from 'worker_threads';
export interface ISendOpts {
    name: string;
    data?: any;
    transferList?: Array<ArrayBuffer | MessagePort>;
    executionTimeout?: number;
}
export declare class RPCWorker extends Worker {
    private started;
    private msgPort;
    private tasks;
    private targetFile;
    private defaultExecutionTimeout;
    constructor(filename: string, options?: WorkerOptions | undefined);
    init(): Promise<RPCWorker>;
    send({ name, data, transferList, executionTimeout, }: ISendOpts): Promise<unknown>;
    setDefaultExecutionTimeout(timeout: number): void;
    private responseHandler;
}
export default RPCWorker;
//# sourceMappingURL=RPCWorker.d.ts.map