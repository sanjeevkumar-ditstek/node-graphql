"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from 'dotenv';
// dotenv.config();
const fileReader_1 = require("../../helper/fileReader");
class UploadFileService {
    constructor(proxy) {
        this.uploadSingleFile = async (file) => {
            const url = await (0, fileReader_1.fileReader)(file);
            return url;
        };
        this.uploadMultipleFile = async ({ file }) => {
            const fileUrl = [];
            for (let i = 0; i < file.length; i++) {
                const url = await (0, fileReader_1.fileReader)(file[i]);
                fileUrl.push({ url });
            }
            return fileUrl;
        };
        this.proxy = proxy;
    }
}
exports.default = UploadFileService;
