export interface RPCRequest {
  taskId: string;
  name: string;
  data?: any;
}

export interface RPCResponse {
  status: 'success' | 'error' | 'not_found';
  taskId: string;
  name: string;
  response?: any;
}
