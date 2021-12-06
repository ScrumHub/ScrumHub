import { IError } from "./stateInterfaces";

export type APIResponse<T, K> = {
    message: string;
    successful: boolean;
    data: T | null;
    metadata: K | null;
  };
  
  export type RequestResponse<T, K> = {
    code: number;
    response: APIResponse<T, K>|{}|IError;
  };