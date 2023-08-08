import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IRoleService from "../service/role/IRoleService";
import authenticate from "../utils/auth/userAuth";

const roleResolvers = {
  Query: {
    getAllRoles: async (_: any, args: any, contextValue: any) => {
      try {
        // let user: any = authenticate(contextValue.token)
        const response: IRoleService.IGetAllRoleResponse =
          await proxy.role.getRoles();
        return response.data;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    getRole: async (_: any, args: any, contextValue: any) => {
      try {
        //   let user: any = authenticate(contextValue.token)
        const response: IRoleService.IGetRoleResponse =
          await proxy.role.getRole(args);
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
    async createRole(parent: any, args: any, contextValue: any) {
      try {
        // let user: any = authenticate(contextValue.token)
        const payload: IRoleService.ICreateRolePayload = args.data;
        const response: IRoleService.ICreateRoleResponse =
          await proxy.role.create(payload);
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
    updateRole: async (_: any, args: any, contextValue: any) => {
      try {
        //   let user: any = authenticate(contextValue.token)
        const payload: IRoleService.IUpdateRolePayload = args.data;

        const { id, data } = payload;
        const response: IRoleService.IUpdateRoleResponse =
          await proxy.role.updateRole({ id, data });
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
    deleteRole: async (_: any, args: any, contextValue: any) => {
      try {
        const payload: IRoleService.IDeleteRolePayload = args;
        const response: IRoleService.IDeleteRoleResponse =
          await proxy.role.deleteRole(payload);
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

export default roleResolvers;
