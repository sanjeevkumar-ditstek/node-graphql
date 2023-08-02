"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as IRoleService from "./role/IRoleService";
const userService_1 = __importDefault(require("./user/userService"));
const uploadFileService_1 = __importDefault(require("./fileUpload/uploadFileService"));
class AppServiceProxy {
    constructor() {
        this.user = new userService_1.default(this);
        this.uploadFile = new uploadFileService_1.default(this);
    }
}
exports.default = new AppServiceProxy();
