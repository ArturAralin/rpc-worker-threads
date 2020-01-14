/// <reference types="node" />
import { MessagePort } from 'worker_threads';
declare type CallbackFn = (v?: any) => any;
export declare class RPC {
    private handlers;
    constructor(msgPort: MessagePort);
    addHandler(name: string, cb: CallbackFn): void;
}
export {};
//# sourceMappingURL=init-file.d.ts.map