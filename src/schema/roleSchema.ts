import { gql } from "apollo-server-express"; //will create a schema
export const RoleSchema = `
  type Role {
      _id: String,
      name: String
    }
  
  type Query{ 
    getAllRoles: [Role],
    getRole(id: String): Role
  }

  input RoleProps {
    name: String!,
  }

  input RoleUpdateProps {
    name: String!,
  }

  type Mutation {
    #the addRole commmand will accept an argument of type String.
    #it will return a 'Role' instance. 
    createRole(data: RoleProps): Role,
    updateRole(id: String,data: RoleUpdateProps): Role
    deleteRole(id: String): Role
  }
  `;


  export const RoleTypeDefs = gql`${RoleSchema}`
