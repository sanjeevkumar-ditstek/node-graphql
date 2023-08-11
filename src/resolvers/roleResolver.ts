import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IRoleService from "../service/role/IRoleService";
import authenticate from "../utils/auth/userAuth";
import { AuthResponse } from "../utils/interface/common";
import { ContextValidation } from "../helper/contextValidation";
import { CtxValidation } from "../utils/interface/contextValidation";

const roleResolvers = {
  Query: {
    getAllRoles: async (_: any, args: any, contextValue: any) => {
      try {
        // const { token } = contextValue;
        // const authResposne: AuthResponse = authenticate(token);
        // if (authResposne.error) {
        //   return new ApolloError(
        //     authResposne.error,
        //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        //   );
        // }

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
        // const { token } = contextValue;
        // const authResposne: AuthResponse = authenticate(token);
        // if (authResposne.error) {
        //   return new ApolloError(
        //     authResposne.error,
        //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        //   );
        // }
        const { id } = args;
        const response: IRoleService.IGetRoleResponse =
          await proxy.role.getRole({ id });
        if (response.error) {
          return new ApolloError(
            JSON.stringify(response.error),
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
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
    async createRole(
      parent: any,
      args: IRoleService.ICreateRolePayload,
      contextValue: any
    ) {
      try {
        // const { token } = contextValue;
        // const authResposne: AuthResponse = authenticate(token);
        // if (authResposne.error) {
        //   return new ApolloError(
        //     authResposne.error,
        //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        //   );
        // }
        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          false,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }

        const { data } = ctxResponse.args;
        const response: IRoleService.ICreateRoleResponse =
          await proxy.role.create(data);
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
    updateRole: async (
      _: any,
      args: IRoleService.IUpdateRolePayload,
      contextValue: any
    ) => {
      try {
        // const { token } = contextValue;
        // const authResposne: AuthResponse = authenticate(token);
        // if (authResposne.error) {
        //   return new ApolloError(
        //     authResposne.error,
        //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        //   );
        // }

        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          true,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }

        const payload: IRoleService.IUpdateRolePayload = ctxResponse.args;
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
    deleteRole: async (
      _: any,
      args: IRoleService.IDeleteRolePayload,
      contextValue: any
    ) => {
      try {
        // const { token } = contextValue;
        // const authResposne: AuthResponse = authenticate(token);
        // if (authResposne.error) {
        //   return new ApolloError(
        //     authResposne.error,
        //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        //   );
        // }

        const ctxResponse: CtxValidation = ContextValidation(
          args,
          contextValue,
          true
        );
        if (!ctxResponse.success && ctxResponse.error) {
          return ctxResponse.error;
        }
        const { id } = ctxResponse.args;
        const response: IRoleService.IDeleteRoleResponse =
          await proxy.role.deleteRole({ id });
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
