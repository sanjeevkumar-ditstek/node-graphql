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
            try {
                // let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.user.getUsers();
                console.log(response.data, "gghdskdkjadskajljfalfjlaflajfldsajflkdsjflkdajfldsjf");
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
        },
        getUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.user.getUser(args.data);
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
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
                return response.data;
            }
            catch (e) {
                console.log(e);
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
        },
        updateUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const payload = args.data;
                const response = await appServiceProxy_1.default.user.updateUser({ id: args.id, data: payload });
                if (response.statusCode !== statusCodes_1.default.OK) {
                    throw new apollo_server_express_1.ApolloError(response.error?.message, response.status.toString());
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
        },
        deleteUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const payload = args;
                const response = await await appServiceProxy_1.default.user.deleteUser(payload);
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
        },
        loginUser: async (_, args) => {
            try {
                const payload = args;
                const response = await appServiceProxy_1.default.user.loginUser(payload);
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), '500');
            }
        }
    }
};
exports.default = userResolvers;
