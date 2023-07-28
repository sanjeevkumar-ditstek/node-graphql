"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as IRoleService from "./role/IRoleService";
const userService_1 = __importDefault(require("./user/userService"));
class AppServiceProxy {
    // public role: IRoleService.IRoleServiceAPI;
    constructor() {
        this.user = new userService_1.default(this);
        // this.role = new RoleService(this);
    }
}
exports.default = new AppServiceProxy();
