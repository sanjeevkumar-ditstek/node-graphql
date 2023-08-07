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
            // let user: any = authenticate(contextValue.token)
            const response = await appServiceProxy_1.default.role.getRoles();
            return response.data;
        },
        getRole: async (_, args, contextValue) => {
            //   let user: any = authenticate(contextValue.token)
            const response = await appServiceProxy_1.default.role.getRole(args);
            return response.data;
        }
    },
    Mutation: {
        async createRole(parent, args, contextValue) {
            // let user: any = authenticate(contextValue.token)
            const payload = args.data;
            const response = await appServiceProxy_1.default.role.create(payload);
            if (response.statusCode !== statusCodes_1.default.OK) {
                throw new apollo_server_express_1.ApolloError(response.error?.message, response.status.toString());
            }
            return response.data;
        },
        updateRole: async (_, args, contextValue) => {
            //   let user: any = authenticate(contextValue.token)
            const payload = args.data;
            const { id, data } = payload;
            const response = await appServiceProxy_1.default.role.updateRole({ id, data });
            if (response.statusCode !== statusCodes_1.default.OK) {
                throw new apollo_server_express_1.ApolloError(response.error?.message, response.status.toString());
            }
            return response.data;
        },
        deleteRole: async (_, args, contextValue) => {
            const payload = args;
            const response = await appServiceProxy_1.default.role.deleteRole(payload);
            if (response.statusCode !== statusCodes_1.default.OK) {
                throw new apollo_server_express_1.ApolloError(response.error?.message, response.status.toString());
            }
            return response.data;
        },
    }
};
exports.default = roleResolvers;
