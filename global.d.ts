import { RPC } from './src/init-file';

declare global {
  namespace NodeJS {
    interface Global {
      RPCWorker: RPC;
    }
  }
}