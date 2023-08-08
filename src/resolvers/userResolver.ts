import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IUserService from "../service/user/IUserService";
import { GraphQLUpload } from "graphql-upload";
import authenticate from "../utils/auth/userAuth";
import ErrorMessageEnum from "../utils/enum/errorMessage";

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
    getAllUsers: async (_: any, contextValue: any) => {
      try {
        // const user: any = authenticate(contextValue.token)
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
        // let user: any = authenticate(contextValue.token)
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
    async registerUser(parent: any, args: any, contextValue: any) {
      // let user: any = authenticate(contextValue.token)
      const payload: IUserService.IRegisterUserPayload = args.data
        ? args.data
        : contextValue.args.data;
      let response: IUserService.IRegisterUserResponse;
      try {
        const response: IUserService.IRegisterUserResponse =
          await proxy.user.create(payload);
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
        // let user: any = authenticate(contextValue.token)
        const payload: UpdateUserPayload = args.data;
        const response: IUserService.IUpdateUserResponse =
          await proxy.user.updateUser({ id: args.id, data: payload });
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
        // let user: any = authenticate(contextValue.token)
        const payload: IUserService.IDeleteUserPayload = args;
        const response: IUserService.IDeleteUserResponse =
          await proxy.user.deleteUser(payload);
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
    loginUser: async (_: any, args: any) => {
      try {
        const payload: IUserService.ILoginPayload = args;
        const response: IUserService.ILoginResponse =
          await proxy.user.loginUser(payload);
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
