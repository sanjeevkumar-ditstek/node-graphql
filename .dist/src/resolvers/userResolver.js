"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const graphql_upload_1 = require("graphql-upload");
const userAuth_1 = __importDefault(require("../utils/auth/userAuth"));
const contextValidation_1 = require("../helper/contextValidation");
const userResolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
    Query: {
        getAllUsers: async (_, args, contextValue) => {
            try {
                const authResposne = (0, userAuth_1.default)(contextValue.token);
                if (authResposne.error) {
                    return new apollo_server_express_1.ApolloError(authResposne.error, statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
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
                const authResposne = (0, userAuth_1.default)(contextValue.token);
                if (authResposne.error) {
                    return new apollo_server_express_1.ApolloError(authResposne.error, statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
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
            try {
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, false, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { data } = ctxResponse.args.data;
                const response = await appServiceProxy_1.default.user.create(data);
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
                const authResposne = (0, userAuth_1.default)(contextValue.token);
                if (authResposne.error) {
                    return new apollo_server_express_1.ApolloError(authResposne.error, statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, true, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { data, id } = ctxResponse.args;
                const response = await appServiceProxy_1.default.user.updateUser({ id, data });
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
                const authResposne = (0, userAuth_1.default)(contextValue.token);
                if (authResposne.error) {
                    return new apollo_server_express_1.ApolloError(authResposne.error, statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { id } = ctxResponse.args;
                const response = await appServiceProxy_1.default.user.deleteUser({ id });
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(response.error?.message);
                }
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        loginUser: async (_, args, contextValue) => {
            try {
                const ctxResponse = (0, contextValidation_1.ContextValidation)(args, contextValue, false, true);
                if (!ctxResponse.success && ctxResponse.error) {
                    return ctxResponse.error;
                }
                const { email, password } = ctxResponse.args.data;
                const response = await appServiceProxy_1.default.user.loginUser({ email, password });
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
