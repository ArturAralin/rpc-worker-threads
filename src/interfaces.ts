export interface IRPCRequest {
  taskId: string;
  name: string;
  data?: any;
}

export interface IRPCResponse {
  status: 'success' | 'error' | 'not_found';
  taskId: string;
  name: string;
  response?: any;
}
