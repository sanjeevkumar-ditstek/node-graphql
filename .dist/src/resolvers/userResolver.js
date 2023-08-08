"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const graphql_upload_1 = require("graphql-upload");
const userResolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
    Query: {
        getAllUsers: async (_, contextValue) => {
            try {
                // const user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.user.getUsers();
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        getUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.user.getUser(args);
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
    Mutation: {
        async registerUser(parent, args, contextValue) {
            // let user: any = authenticate(contextValue.token)
            const payload = args.data
                ? args.data
                : contextValue.args.data;
            let response;
            try {
                const response = await appServiceProxy_1.default.user.create(payload);
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                console.log(e);
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        updateUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const payload = args.data;
                const response = await appServiceProxy_1.default.user.updateUser({ id: args.id, data: payload });
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        deleteUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const payload = args;
                const response = await appServiceProxy_1.default.user.deleteUser(payload);
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        loginUser: async (_, args) => {
            try {
                const payload = args;
                const response = await appServiceProxy_1.default.user.loginUser(payload);
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
exports.default = userResolvers;
