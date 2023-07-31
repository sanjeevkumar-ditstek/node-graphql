import * as IUserService from "../service/user/IUserService";

export const apiResponse = (
  statusCode: number,
  message: string,
  data: any,
  status: boolean,
  error: any
) => {


  return {
    status,
    error,
    statusCode,
    message,
    data
  };
};
