"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleSchema_1 = require("./roleSchema");
const userSchema_1 = require("./userSchema");
exports.default = [userSchema_1.UserTypeDefs, roleSchema_1.RoleTypeDefs];
