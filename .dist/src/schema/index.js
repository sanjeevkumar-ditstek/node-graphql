"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleSchema_1 = require("./roleSchema");
const uploadSchema_1 = require("./uploadSchema");
const userSchema_1 = require("./userSchema");
exports.default = [userSchema_1.UserTypeDefs, roleSchema_1.RoleTypeDefs, uploadSchema_1.FileUploadTypeDefs];
