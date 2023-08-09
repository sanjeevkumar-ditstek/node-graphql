import { IResponse } from "../utils/interface/common";

export const apiResponse = (data: any, error: any): IResponse => {
  return {
    error,
    data,
  };
};
