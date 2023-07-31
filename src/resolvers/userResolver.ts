import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes"
import * as IUserService from "../service/user/IUserService"
import authenticate from "../utils/auth/userAuth"

type User = {
  _id?: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

type UpdateUserPayload = {
  id?: string,
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string
}

const userResolvers = {
  Query: {
    getAllUsers: async (_: any, contextValue: any) => {
      try{
      // let user: any = authenticate(contextValue.token)
      const response: IUserService.IGetAllUserResponse = await proxy.user.getUsers()

      console.log(response.data, "gghdskdkjadskajljfalfjlaflajfldsajflkdsjflkdajfldsjf")
        return response.data;
      }catch(e){
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    },
    getUser: async (_: any, args: IUserService.IGetUserArgsPayload, contextValue: any) => {
      try{
      // let user: any = authenticate(contextValue.token)
      const response: IUserService.IGetUserResponse = await proxy.user.getUser(args.data)
      return response.data;
      }catch(e){
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    }
  },
  Mutation: {
    async registerUser(parent: any, args: IUserService.IRegisterUserArgsPayload, contextValue: any) {
      // let user: any = authenticate(contextValue.token)
      const payload: IUserService.IRegisterUserPayload = args.data;
      // let response: IUserService.IRegisterUserResponse;
      try {
        const response: IUserService.IRegisterUserResponse = await proxy.user.create(payload);
        if (!response) {
          // throw new ApolloError(
          //   response.error?.message,
          //   response.status.toString()
        }
        return response.data;
      } catch (e) {
        console.log(e)
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    },
    updateUser: async (_: any, args: IUserService.IUpdateUserPayload, contextValue: any) => {
      try{
      // let user: any = authenticate(contextValue.token)
      const payload: UpdateUserPayload = args.data;
      const response: IUserService.IUpdateUserResponse = await proxy.user.updateUser({ id: args.id, data: payload });
        if (response.statusCode !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error?.message,
            response.status.toString()
          );
        }
      return response.data;
      }catch(e){
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    },
    deleteUser: async (_: any, args: IUserService.IDeleteUserPayload, contextValue: any) => {
      try{
      // let user: any = authenticate(contextValue.token)
        const payload: IUserService.IDeleteUserPayload = args;
        const response: IUserService.IDeleteUserResponse = await await proxy.user.deleteUser(payload);
        return response.data;
      }catch(e){
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    },
    loginUser: async (_: any, args: any) => {
      try{
        const payload: IUserService.ILoginPayload = args;
        const response: IUserService.ILoginResponse = await proxy.user.loginUser(payload);
        return response.data
      }catch(e){
        return new ApolloError(JSON.stringify(e) ,'500')
      }
    }
  }
};

export default userResolvers;
