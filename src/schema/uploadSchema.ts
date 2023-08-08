import { gql } from "apollo-server-express"; //will create a schema
export const FileUploadSchema = `
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
`

export const FileUploadTypeDefs = gql`${FileUploadSchema}`;