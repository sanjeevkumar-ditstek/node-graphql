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
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
            }
        },
        getUser: async (_, args, contextValue) => {
            try {
                // let user: any = authenticate(contextValue.token)
                const response = await appServiceProxy_1.default.user.getUser(args);
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
            }
        },
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
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
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
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
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
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
            }
        },
        loginUser: async (_, args) => {
            try {
                const payload = args;
                const response = await appServiceProxy_1.default.user.loginUser(payload);
                return response.data;
            }
            catch (e) {
                return new apollo_server_express_1.ApolloError(JSON.stringify(e), "500");
            }
        },
        singleUpload: async (_, { file }) => {
            const imageUrl = await appServiceProxy_1.default.uploadFile.uploadSingleFile(file);
            // const singlefile = new SingleFile({image: imageUrl});
            // await singlefile.save();
            console.log({ image: imageUrl }, "{image: imageUrl}!!");
            return {
                message: "Single file uploaded successfully!",
            };
        },
        multipleUpload: async (_, file) => {
            console.log(await file, "file ksjdk");
            const imageUrls = await appServiceProxy_1.default.uploadFile.uploadMultipleFile(await file);
            // const multiplefile = new MultipleFile();
            // multiplefile.images.push(...imageUrl);
            // multiplefile.save();
            console.log({ image: imageUrls }, "{image: imageUrls}");
            return {
                message: "Multiple File uploaded successfully!",
            };
        },
    },
};
exports.default = userResolvers;
