import { gql } from "apollo-server-express"; //will create a schema
const UserTypeDefs = gql`
  type User {
    _id: String!,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: Int,
    roles: [Role]
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
    role: String,
  }

  input UserUpdateProps {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: Int,
    role: String,
  }

  type Mutation {
    #the addPerson commmand will accept an argument of type String.
    #it will return a 'Person' instance. 
    registerUser(data: UserProps): User,
    updateUser(id: String,data: UserUpdateProps): User
    deleteUser(id: String): User
    loginUser(email: String,password: String): Login
    userLogs([User],[User]): [User]
  }
  `;

export default UserTypeDefs;
