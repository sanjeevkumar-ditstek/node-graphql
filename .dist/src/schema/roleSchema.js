"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTypeDefs = exports.RoleSchema = void 0;
const apollo_server_express_1 = require("apollo-server-express"); //will create a schema
exports.RoleSchema = `
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
exports.RoleTypeDefs = (0, apollo_server_express_1.gql) `${exports.RoleSchema}`;
