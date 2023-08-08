"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadTypeDefs = exports.FileUploadSchema = void 0;
const apollo_server_express_1 = require("apollo-server-express"); //will create a schema
exports.FileUploadSchema = `
    scalar Upload

    type File {
    filename: String!
    mimetype: String!
    encoding: String!
    }
    type SuccessMessage {
    message: String
    }

    type Error {
    message: String,
    code: String,
    }

    type Mutation {
    singleUpload(file: Upload!): SuccessMessage
    multipleUpload(file: [Upload]!): SuccessMessage
    }
`;
exports.FileUploadTypeDefs = (0, apollo_server_express_1.gql) `${exports.FileUploadSchema}`;
