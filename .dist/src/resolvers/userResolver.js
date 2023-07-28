"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const userResolvers = {
    Query: {
        getAllUsers: async (_, contextValue) => {
            // let user: any = authenticate(contextValue.token)
            const response = await appServiceProxy_1.default.user.getUsers();
            return response.data;
        },
        getUser: async (_, args, contextValue) => {
            // let user: any = authenticate(contextValue.token)
            const response = await appServiceProxy_1.default.user.getUser(args.data);
            return response.data;
        }
    },
    Mutation: {
        async registerUser(parent, args, contextValue) {
            // let user: any = authenticate(contextValue.token)
            const payload = args.data;
            // let response: IUserService.IRegisterUserResponse;
            try {
                const response = await appServiceProxy_1.default.user.create(payload);
                if (!response) {
                    // throw new ApolloError(
                    //   response.error?.message,
                    //   response.status.toString()
                }
                return response;
            }
            catch (e) {
                console.log(e);
                // throw e;
            }
        },
        updateUser: async (_, args, contextValue) => {
            // let user: any = authenticate(contextValue.token)
            const payload = args.data;
            const response = await appServiceProxy_1.default.user.updateUser({ id: args.id, data: payload });
            if (response.statusCode !== statusCodes_1.default.OK) {
                throw new apollo_server_express_1.ApolloError(response.error?.message, response.status.toString());
            }
            return response.data;
        },
        deleteUser: async (_, args, contextValue) => {
            // let user: any = authenticate(contextValue.token)
            const payload = args;
            const response = await await appServiceProxy_1.default.user.deleteUser(payload);
            return response.data;
        },
        loginUser: async (_, args) => {
            const payload = args;
            const response = await appServiceProxy_1.default.user.loginUser(payload);
            return response.data;
        }
    }
};
exports.default = userResolvers;
