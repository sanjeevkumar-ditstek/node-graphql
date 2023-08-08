"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const roleResolvers = {
    Query: {
        getAllRoles: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.role.getRoles();
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        getRole: async (_, args, contextValue) => {
            try {
                //   let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.role.getRole(args);
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
                // let user: any = authenticate(contextValue.token)
                const payload = args.data;
                const response = await appServiceProxy_1.default.role.create(payload);
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
                //   let user: any = authenticate(contextValue.token)
                const payload = args.data;
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
                const payload = args;
                const response = await appServiceProxy_1.default.role.deleteRole(payload);
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
