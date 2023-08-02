"use strict";
// import proxy from "../service/appServiceProxy";
// import { ApolloError } from "apollo-server-express";
// import STATUS_CODES from "../utils/enum/statusCodes";
// import * as IRoleService from "../service/role/IRoleService";
// import authenticate from "../utils/auth/userAuth";
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
//       const response: IRoleService.IGetAllRoleResponse =await proxy.role.getRoles();
//         return response.data;
//     },
//     getRole: async (_: any, args: any, contextValue: any) => {
//     //   let user: any = authenticate(contextValue.token)
//       let response: IRoleService.IGetRoleResponse = await proxy.role.getRole(args)
//         return response.data;
//     }
//   },
//   Mutation: {
//     async createRole(parent: any, args: any, contextValue: any) {
//       // let user: any = authenticate(contextValue.token)
//       const payload: IRoleService.ICreateRolePayload = args.data;
//       let response: IRoleService.ICreateRoleResponse = await proxy.role.create(payload);
//         if (response.statusCode !== STATUS_CODES.OK) {
//           throw new ApolloError(
//             response.error?.message,
//             response.status.toString()
//           );
//         }
//       return response.data;
//     },
//     updateRole: async (_: any, args: any, contextValue: any) => {
//     //   let user: any = authenticate(contextValue.token)
//       const payload: IRoleService.IUpdateRolePayload = args.data;
//         let { id, ...rest } = payload
//         let response: IRoleService.IUpdateRoleResponse = await proxy.role.updateRole({ id, data: rest });
//         if (response.statusCode !== STATUS_CODES.OK) {
//           throw new ApolloError(
//             response.error?.message,
//             response.status.toString()
//           );
//         }
//       return response.data;
//     },
//     deleteRole: async (_: any, args: any, contextValue: any) => {
//         let payload: IRoleService.IDeleteRolePayload = args = await await proxy.role.deleteRole(payload);
//         return response.data
//     },
//   }
// };
// export default roleResolvers;
