"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express"); //will create a schema
const UserTypeDefs = (0, apollo_server_express_1.gql) `
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type SuccessMessage {
    message: String
  }

  type User {
    _id: String!,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: Int,
    #roles: [Role]
  }

  type Error {
  message: String,
  code: String,
}
  
  type UserResponse{
    user: User,
    statusCode: Int,
    message: String,
    error: Error
  }
  type Login {
    token: String!
    user: User
  }

  type Query{ 
    getAllUsers: [User],
    getUser(id: String): User
  }

  input UserProps {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: Int,
    #role: String,
  }

  input UserUpdateProps {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: Int,
    #role: String,
  }

  type Mutation {
    #the addPerson commmand will accept an argument of type String.
    #it will return a 'Person' instance. 
    registerUser(data: UserProps): User,
    updateUser(id: String,data: UserUpdateProps): User
    deleteUser(id: String): User
    loginUser(email: String,password: String): Login
    singleUpload(file: Upload!): SuccessMessage
    multipleUpload(file: [Upload]!): SuccessMessage
  }
  `;
exports.default = UserTypeDefs;
