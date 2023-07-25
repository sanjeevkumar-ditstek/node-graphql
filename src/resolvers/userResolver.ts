import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes"
import * as IUserService from "../service/user/IUserService"
import authenticate from "../utils/auth/userAuth"

type User = {
  _id?: String,
  firstname: String,
  lastname: String,
  email: String,
  password: string
}

type UpdateUserPayload = {
  id: string,
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string
}

const userResolvers = {
  Query: {
    getAllUsers: async (_: any, args: any, contextValue: any) => {
      // let user: any = authenticate(contextValue.token)
      let response: IUserService.IGetAllUserResponse;
      try {
        response = await proxy.user.getUsers()
        return response.data;
      } catch (e) {
        throw e;
      }
    },
    getUser: async (_: any, args: any, contextValue: any) => {
      // let user: any = authenticate(contextValue.token)
      let response: IUserService.IGetUserResponse;
      try {
        response = await proxy.user.getUser(args)
        return response.data;
      } catch (e) {
        throw e;
      }
    }
  },
  Mutation: {
    async registerUser(parent: any, args: any, contextValue: any) {
      // let user: any = authenticate(contextValue.token)
      const payload: IUserService.IRegisterUserPayload = args.data;
      let response: IUserService.IRegisterUserResponse;
      try {
        response = await proxy.user.create(payload);
        if (response.statusCode !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error?.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.data;
    },
    updateUser: async (_: any, args: any, contextValue: any) => {
      // let user: any = authenticate(contextValue.token)
      const payload: UpdateUserPayload = args.data;
      let response: IUserService.IUpdateUserResponse;
      try {
        let { id, ...rest } = payload
        response = await proxy.user.updateUser({ id: args.id, data: payload });
        if (response.statusCode !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error?.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.data;
    },
    deleteUser: async (_: any, args: any, contextValue: any) => {
      // let user: any = authenticate(contextValue.token)
      try {
        let payload: IUserService.IDeleteUserPayload = args;
        let response: IUserService.IDeleteUserResponse;
        response = await await proxy.user.deleteUser(payload);
        return response.data
      } catch (e) {
        throw e;
      }
    },
    loginUser: async (_: any, args: any) => {
      try {
        let payload: IUserService.ILoginPayload = args;
        let response: IUserService.ILoginResponse;
        response = await proxy.user.loginUser(payload);
        return response.data
      } catch (e) {
        throw e;
      }
    },
  //   userLogs: async (_: any, args: any) => {
  //     try {
  //       let payload: IUserService.ILogsPayload = args;
  //       let result: IUserService.ILogsResponse = ModelLogCreater(payload.oldData , payload.oldData, proxy.user.getUser )

  //       return result;
  //     } catch (e) {
  //       throw e;
  //     }
  //   },

  }
};

export default userResolvers;
