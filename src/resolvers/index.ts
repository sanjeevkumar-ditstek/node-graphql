import RoleResolvers from "./roleResolver";
import UserResolvers from "./userResolver";
import {GraphQLUpload} from"graphql-upload";
const customResolvers = {
    Upload: GraphQLUpload
}

export default [customResolvers,UserResolvers , RoleResolvers];
