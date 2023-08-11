import { ApolloError } from "apollo-server-express";
import ErrorMessageEnum from "../utils/enum/errorMessage";
import STATUS_CODES from "../utils/enum/statusCodes";
import { CtxValidation } from "../utils/interface/contextValidation";

export const ContextValidation = (
  args: any,
  contextValue: any,
  isId = false,
  isData = false
): CtxValidation => {
  const response: CtxValidation = { success: false, error: null , args: null };
  try {
    if (
      !args.data &&
      (isData ? !args.data : true) &&
      (isId ? !args.id : true)
    ) {
      if (!contextValue.args) {
        response.error = new ApolloError(
          ErrorMessageEnum.GRAPH_QL__ARGS_ERROR,
          STATUS_CODES.BAD_REQUEST.toString()
        );
        return response;
      }
      if (
        (isData ? !contextValue.args.data : true) &&
        (isId ? !contextValue.args.id : true)
      ) {
        response.error = new ApolloError(
          ErrorMessageEnum.GRAPH_QL_CONTEXT_ARGS_ERROR,
          STATUS_CODES.BAD_REQUEST.toString()
        );
        return response;
      }
    }
    response.success = true;
    response.args = (args.data || (isData ? args.data : false) || (isId ? args.id : false)) ? args : contextValue.args
    return response;
  } catch (e) {
    response.error = new ApolloError(
      JSON.stringify(e),
      STATUS_CODES.BAD_REQUEST.toString()
    );
    return response;
  }
};
