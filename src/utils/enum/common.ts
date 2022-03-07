import StatusCodeEnum from "./StatusCodeEnum";

export interface IRequest {
  status?: StatusCodeEnum;
}

export interface IResponse {
  status?: StatusCodeEnum;
  error?: IError;
}

export interface IError {
  message: string;
}

export function toError(message: string): IError {
  const error: IError = {
    message,
  };
  return error;
}