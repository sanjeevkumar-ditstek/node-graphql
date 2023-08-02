"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import RoleResolvers from "./roleResolver";
const userResolver_1 = __importDefault(require("./userResolver"));
const graphql_upload_1 = require("graphql-upload");
const customResolvers = {
    Upload: graphql_upload_1.GraphQLUpload
};
exports.default = [customResolvers, userResolver_1.default];
