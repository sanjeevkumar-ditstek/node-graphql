import { ApolloError } from "apollo-server-express";
import { logger } from "../../service/logger/logger";
import StatusCodeEnum from "./StatusCodeEnum";

export const Response = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkStatus: (response: any) => {
    if (response.status === StatusCodeEnum.OK) return;
    throw new ApolloError(response.error, response.status.toString(), {
      errors: response?.error?.details || [],
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catchThrow: (err: any) => {
    console.log(err);
    logger.log("error", err.message);
    throw err;
  },
};