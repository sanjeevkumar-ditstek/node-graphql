"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.getRoleByNameSchema = exports.getRoleSchema = exports.roleSchema = exports.fileSchema = exports.getUserSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userCreateSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    role: joi_1.default.string().required(),
});
exports.userUpdateSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string(),
    lastname: joi_1.default.string(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string(),
    age: joi_1.default.number(),
    role: joi_1.default.string(),
});
exports.getUserSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required()
});
exports.fileSchema = joi_1.default.object({
    fileExtension: joi_1.default.string().required(),
    mimetype: joi_1.default.string().required(),
    size: joi_1.default.number().positive().greater(0).required()
});
exports.roleSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
});
exports.getRoleSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required(),
});
exports.getRoleByNameSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
