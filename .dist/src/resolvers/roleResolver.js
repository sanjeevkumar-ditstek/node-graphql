"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const contextValidation_1 = require("../helper/contextValidation");
const roleResolvers = {
    Query: {
        getAllRoles: async (_, args, contextValue) => {
            try {
                // const { token } = contextValue;
                // const authResposne: AuthResponse = authenticate(token);
                // if (authResposne.error) {
                //   return new ApolloError(
                //     authResposne.error,
                //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
                //   );
                // }
                const response = await appServiceProxy_1.default.role.getRoles();
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        getRole: async (_, args, contextValue) => {
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
                const response = await appServiceProxy_1.default.role.getRole({ id });
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(JSON.stringify(response.error), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
    },
    Mutation: {
        async createRole(parent, args, contextValue) {
            try {
                // const { token } = contextValue;
                // const authResposne: AuthResponse = authenticate(token);
                // if (authResposne.error) {
                //   return new ApolloError(
                //     authResposne.error,
                //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
                //   );
                // }
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, false, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { data } = ctxResponse.args;
                const response = await appServiceProxy_1.default.role.create(data);
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        updateRole: async (_, args, contextValue) => {
            try {
                // const { token } = contextValue;
                // const authResposne: AuthResponse = authenticate(token);
                // if (authResposne.error) {
                //   return new ApolloError(
                //     authResposne.error,
                //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
                //   );
                // }
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, true, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const payload = ctxResponse.args;
                const { id, data } = payload;
                const response = await appServiceProxy_1.default.role.updateRole({ id, data });
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        deleteRole: async (_, args, contextValue) => {
            try {
                // const { token } = contextValue;
                // const authResposne: AuthResponse = authenticate(token);
                // if (authResposne.error) {
                //   return new ApolloError(
                //     authResposne.error,
                //     STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
                //   );
                // }
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { id } = ctxResponse.args;
                const response = await appServiceProxy_1.default.role.deleteRole({ id });
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
    },
};
exports.default = roleResolvers;
