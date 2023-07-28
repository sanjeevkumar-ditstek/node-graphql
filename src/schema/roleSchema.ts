// import { gql } from "apollo-server-express"; //will create a schema
// const RoleTypeDefs = gql`
//   type Role {
//       _id: String,
//       role: String
//     }
  
//   type Query{ 
//     getAllRoles: [Role],
//     getRole(id: String): Role
//   }

//   input RoleProps {
//     role: String,
//   }

//   input RoleUpdateProps {
//     role: String,
//   }

//   type Mutation {
//     #the addRole commmand will accept an argument of type String.
//     #it will return a 'Role' instance. 
//     createRole(data: RoleProps): Role,
//     updateRole(id: String,data: RoleUpdateProps): Role
//     deleteRole(id: String): Role
//   }
//   `;

// export default RoleTypeDefs;
