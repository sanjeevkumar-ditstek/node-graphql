import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IUserService from "../service/user/IUserService";
import { GraphQLUpload } from "graphql-upload";
import authenticate from "../utils/auth/userAuth";
import ErrorMessageEnum from "../utils/enum/errorMessage";
import { ContextValidation } from "../helper/contextValidation";
import { CtxValidation } from "../utils/interface/contextValidation";
import { AuthResponse } from "../utils/interface/common";

type UpdateUserPayload = {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

const userResolvers = {
  Upload: GraphQLUpload,
  Query: {
    getAllUsers: async (_: any, args: any, contextValue: any) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const response: IUserService.IGetAllUserResponse =
          await proxy.user.getUsers();
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    getUser: async (
      _: any,
      args: IUserService.IGetUserArgsPayload,
      contextValue: any
    ) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const response: IUserService.IGetUserResponse =
          await proxy.user.getUser(args);
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
  },
  Mutation: {
    async registerUser(
      parent: any,
      args: IUserService.IRegisterUserArgsPayload,
      contextValue: any
    ) {
      // let user: any = authenticate(contextValue.token)
      try {
        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          false,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }
        const { data } = ctxResponse.args.data;
        const response: IUserService.IRegisterUserResponse =
          await proxy.user.create(data);
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        console.log(e);
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    updateUser: async (
      _: any,
      args: IUserService.IUpdateUserPayload,
      contextValue: any
    ) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          true,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }
        const { data, id } = ctxResponse.args;
        const response: IUserService.IUpdateUserResponse =
          await proxy.user.updateUser({ id, data });
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    deleteUser: async (
      _: any,
      args: IUserService.IDeleteUserPayload,
      contextValue: any
    ) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }
        const { id } = ctxResponse.args;
        const response: IUserService.IDeleteUserResponse =
          await proxy.user.deleteUser({ id });
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    loginUser: async (_: any, args: any, contextValue: any) => {
      try {
        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          false,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }
        const { email, password } = ctxResponse.args.data;
        const response: IUserService.ILoginResponse =
          await proxy.user.loginUser({ email, password });
        if (response.error) {
          return new ApolloError(response.error?.message);
        }
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
  },
};

export default userResolvers;
