import proxy from "../service/appServiceProxy";
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../utils/enum/statusCodes";
import * as IUserService from "../service/user/IUserService";
import { GraphQLUpload } from "graphql-upload";
import authenticate from "../utils/auth/userAuth";
import * as IUploadFileService from "../service/fileUpload/IUploadFileService";

const fileUploadResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (_: any, { file }: any) => {
      try {
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
    multipleUpload: async (_: any, file: any) => {
      try {
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
