"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const apollo_server_express_1 = require("apollo-server-express");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const graphql_upload_1 = require("graphql-upload");
const fileUploadResolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
    Mutation: {
        singleUpload: async (_, { file }) => {
            try {
                const response = await appServiceProxy_1.default.uploadFile.uploadSingleFile(file);
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(JSON.stringify(response.error), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
                return response;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
        multipleUpload: async (_, file) => {
            try {
                const response = await appServiceProxy_1.default.uploadFile.uploadMultipleFile(await file);
                if (response.error) {
                    return new apollo_server_express_1.ApolloError(JSON.stringify(response.error), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
                }
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.INTERNAL_SERVER_ERROR.toString());
            }
        },
    },
};
exports.default = fileUploadResolvers;
