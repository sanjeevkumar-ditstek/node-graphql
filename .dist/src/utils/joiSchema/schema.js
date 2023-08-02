"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSchema = exports.getUserSchema = exports.userUploadSchema = exports.userCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userCreateSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    // role: Joi.string().required(),
});
exports.userUploadSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string(),
    lastname: joi_1.default.string(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string(),
    age: joi_1.default.number(),
    // role: Joi.string().required(),
});
exports.getUserSchema = joi_1.default.object().keys({
    id: joi_1.default.string().required()
});
exports.fileSchema = joi_1.default.object({
    fileExtension: joi_1.default.string().required(),
    mimetype: joi_1.default.string().required(),
    size: joi_1.default.number().positive().greater(0).required()
});
