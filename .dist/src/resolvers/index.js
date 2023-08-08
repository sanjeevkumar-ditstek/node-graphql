"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileUploadResolver_1 = __importDefault(require("./fileUploadResolver"));
const roleResolver_1 = __importDefault(require("./roleResolver"));
const userResolver_1 = __importDefault(require("./userResolver"));
const graphql_upload_1 = require("graphql-upload");
const customResolvers = {
    Upload: graphql_upload_1.GraphQLUpload,
};
exports.default = [
    customResolvers,
    userResolver_1.default,
    roleResolver_1.default,
    fileUploadResolver_1.default,
];
