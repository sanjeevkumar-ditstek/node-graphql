import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IUserService from "../service/user/IUserService";
import { GraphQLUpload } from "graphql-upload";
import authenticate from "../utils/auth/userAuth";
import * as IUploadFileService from "../service/fileUpload/IUploadFileService";
import { AuthResponse } from "../utils/interface/common";

const fileUploadResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (_: any, { file }: any, contextValue: any) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const response: IUploadFileService.IFileUploadResponse =
          await proxy.uploadFile.uploadSingleFile(file);
        if (response.error) {
          return new ApolloError(
            JSON.stringify(response.error),
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        return response;
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
    multipleUpload: async (_: any, file: any, contextValue: any) => {
      try {
        const authResposne: AuthResponse = authenticate(contextValue.token);
        if (authResposne.error) {
          return new ApolloError(
            authResposne.error,
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
        const response: IUploadFileService.IFileUploadResponse =
          await proxy.uploadFile.uploadMultipleFile(await file);
        if (response.error) {
          return new ApolloError(
            JSON.stringify(response.error),
            STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
          );
        }
      } catch (e) {
        return new ApolloError(
          JSON.stringify(e),
          STATUS_CODES.INTERNAL_SERVER_ERROR.toString()
        );
      }
    },
  },
};

export default fileUploadResolvers;
