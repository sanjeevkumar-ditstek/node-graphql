"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from 'dotenv';
// dotenv.config();
const fileReader_1 = require("../../helper/fileReader");
const errorMessage_1 = __importDefault(require("../../utils/enum/errorMessage"));
const responseMessage_1 = __importDefault(require("../../utils/enum/responseMessage"));
class UploadFileService {
    constructor(proxy) {
        this.uploadSingleFile = async (file) => {
            //should return response
            const response = await (0, fileReader_1.fileReader)(file);
            return response;
        };
        this.uploadMultipleFile = async ({ file }) => {
            // should return response
            const response = {
                message: errorMessage_1.default.FILE_INTERNAL_ERROR
            };
            for (let i = 0; i < file.length; i++) {
                const response = await (0, fileReader_1.fileReader)(file[i]);
                if (response.error) {
                    return response;
                }
            }
            response.message = responseMessage_1.default.FILES_UPLOADED;
            return response;
        };
        this.proxy = proxy;
    }
}
exports.default = UploadFileService;
