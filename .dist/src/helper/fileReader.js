"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReader = void 0;
const JoiValidate_1 = require("./JoiValidate");
const schema_1 = require("../utils/joiSchema/schema");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const errorMessage_1 = __importDefault(require("../utils/enum/errorMessage"));
const responseMessage_1 = __importDefault(require("../utils/enum/responseMessage"));
const fileReader = async (file) => {
    const fileReaderResponse = {
        message: errorMessage_1.default.FILE_INTERNAL_ERROR,
        error: {
            message: errorMessage_1.default.FILE_INTERNAL_ERROR,
            code: statusCodes_1.default.INTERNAL_SERVER_ERROR.toString(),
        },
    };
    try {
        const { createReadStream, filename, encoding, mimetype } = await file;
        const fileSize = 1;
        // await this.getFileSize(encoding, createReadStream);
        const stream = createReadStream();
        const { ext } = (0, path_1.parse)(filename);
        let { name } = (0, path_1.parse)(filename);
        const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.fileSchema, {
            fileExtension: ext,
            size: fileSize,
            mimetype,
        });
        if (error) {
            console.error(error);
            fileReaderResponse.error = {
                message: JSON.stringify(error),
                code: statusCodes_1.default.INTERNAL_SERVER_ERROR.toString(),
            };
            return fileReaderResponse;
        }
        name = `single${Math.floor(Math.random() * 10000 + 1)}`;
        let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
        const imageStream = await fs_1.default.createWriteStream(url);
        await stream.pipe(imageStream);
        const baseUrl = process.env.BASE_URL;
        const port = process.env.PORT;
        url = `${baseUrl}:${port}/${url.split("upload")[1]}`;
        fileReaderResponse.message = responseMessage_1.default.FILE_UPLOADED;
        fileReaderResponse.error = undefined;
        return fileReaderResponse;
    }
    catch (error) {
        console.error(error);
        fileReaderResponse.error = { message: JSON.stringify(error), code: statusCodes_1.default.INTERNAL_SERVER_ERROR.toString() };
        return fileReaderResponse;
    }
};
exports.fileReader = fileReader;
const getFileSize = async (encoding, createReadStreamFunc) => {
    return new Promise((reject, resolve) => {
        try {
            let fileSize = 0;
            const readStream = createReadStreamFunc();
            readStream.on("data", (chunk) => {
                fileSize += Buffer.byteLength(chunk, encoding);
            });
            readStream.on("end", () => {
                resolve(fileSize);
            });
            readStream.on("error", (err) => {
                reject(err);
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
