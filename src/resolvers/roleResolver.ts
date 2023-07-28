// import proxy from "../service/appServiceProxy";
// import { ApolloError } from "apollo-server-express";
// import STATUS_CODES from "../utils/enum/statusCodes"
// import * as IRoleService from "../service/role/IRoleService"
// import authenticate from "../utils/auth/userAuth"

// type Role = {
//   _id?: String,
//   role: String,
// }

// type UpdateRolePayload = {
//   id: string,
//   role?: string,
// }

// const roleResolvers = {
//   Query: {
//     getAllRoles: async (_: any, args: any, contextValue: any) => {
//       // let user: any = authenticate(contextValue.token)
//       let response: IRoleService.IGetAllRoleResponse;
//       try {
//         response = await proxy.role.getRoles();
//         return response.data;
//       } catch (e) {
//         throw e;
//       }
//     },
//     getRole: async (_: any, args: any, contextValue: any) => {
//     //   let user: any = authenticate(contextValue.token)
//       let response: IRoleService.IGetRoleResponse;
//       try {
//         response = await proxy.role.getRole(args)
//         return response.data;
//       } catch (e) {
//         throw e;
//       }
//     }
//   },
//   Mutation: {
//     async createRole(parent: any, args: any, contextValue: any) {
//       // let user: any = authenticate(contextValue.token)
//       const payload: IRoleService.ICreateRolePayload = args.data;
//       let response: IRoleService.ICreateRoleResponse;
//       try {
//         response = await proxy.role.create(payload);
//         if (response.statusCode !== STATUS_CODES.OK) {
//           throw new ApolloError(
//             response.error?.message,
//             response.status.toString()
//           );
//         }
//       } catch (e) {
//         throw e;
//       }
//       return response.data;
//     },
//     updateRole: async (_: any, args: any, contextValue: any) => {
//     //   let user: any = authenticate(contextValue.token)
//       const payload: IRoleService.IUpdateRolePayload = args.data;
//       let response: IRoleService.IUpdateRoleResponse;
//       try {
//         let { id, ...rest } = payload
//         response = await proxy.role.updateRole({ id: args.id, data: payload });
//         if (response.statusCode !== STATUS_CODES.OK) {
//           throw new ApolloError(
//             response.error?.message,
//             response.status.toString()
//           );
//         }
//       } catch (e) {
//         throw e;
//       }
//       return response.data;
//     },
//     deleteRole: async (_: any, args: any, contextValue: any) => {
//     //   let user: any = authenticate(contextValue.token)
//       try {
//         let payload: IRoleService.IDeleteRolePayload = args;
//         let response: IRoleService.IDeleteRoleResponse;
//         response = await await proxy.role.deleteRole(payload);
//         return response.data
//       } catch (e) {
//         throw e;
//       }
//     },
//   }
// };

// export default roleResolvers;
