"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const path_2 = require("path"); // This is node built in package
const fs_1 = require("fs"); // this is node built in package
const JoiValidate_1 = require("../../helper/JoiValidate");
const schema_1 = require("../../utils/joiSchema/schema");
const joiErrorHandler_1 = require("../../helper/joiErrorHandler");
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
const storageEngine = multer_1.default.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage: storageEngine,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    //check extension names
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true);
    }
    else {
        cb("Error: You can Only Upload Images!!");
    }
};
class UploadFileService {
    constructor(proxy) {
        this.uploadSingleFile = async (file) => {
            console.log("i m here in read file");
            const { createReadStream, filename, encoding, mimetype } = await file;
            console.log(file, "file....");
            console.log(createReadStream, filename, "sdjbfdskjabfjdsa");
            const fileSize = 1;
            // await this.getFileSize(encoding, createReadStream);
            console.log(fileSize, "File size........");
            const stream = createReadStream();
            const { ext } = (0, path_2.parse)(filename);
            let { name } = (0, path_2.parse)(filename);
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.fileSchema, {
                fileExtension: ext,
                size: fileSize,
                mimetype,
            });
            if (error) {
                console.error(error);
                const joiErr = (0, joiErrorHandler_1.JoiError)(error);
                return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), "unknown");
            }
            name = `single${Math.floor(Math.random() * 10000 + 1)}`;
            let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
            const imageStream = await (0, fs_1.createWriteStream)(url);
            await stream.pipe(imageStream);
            const baseUrl = process.env.BASE_URL;
            const port = process.env.PORT;
            url = `${baseUrl}:${port}/${url.split("Upload")[1]}`;
            return url;
        };
        this.uploadMultipleFile = async ({ file }) => {
            //
            const fileUrl = [];
            console.log("i m here!!!!");
            console.log(file, "sjdnkn");
            for (let i = 0; i < file.length; i++) {
                console.log(file[i], "akmndksndskj");
                const { createReadStream, filename, encoding, mimetype } = await file[i];
                const fileSize = 1;
                // await this.getFileSize(encoding, createReadStream);
                const stream = createReadStream();
                const { ext } = (0, path_2.parse)(filename);
                let { name } = (0, path_2.parse)(filename);
                // const { error, value } = JoiValidate(fileSchema, {
                //   fileExtension: ext,
                //   size: fileSize,
                //   mimetype,
                // });
                // if (error) {
                //   console.error(error);
                //   const joiErr = JoiError(error);
                //   return new ApolloError(JSON.stringify(joiErr), "unknown");
                // }
                name = `single${Math.floor((Math.random() * 10000) + 1)}`;
                let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
                const imageStream = await (0, fs_1.createWriteStream)(url);
                await stream.pipe(imageStream);
                const baseUrl = process.env.BASE_URL;
                const port = process.env.PORT;
                url = `${baseUrl}${port}${url.split('Upload')[1]}`;
                fileUrl.push({ url });
            }
            return fileUrl;
        };
        this.getFileSize = async (encoding, createReadStreamFunc) => {
            return new Promise((reject, resolve) => {
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
            });
        };
        this.proxy = proxy;
    }
}
exports.default = UploadFileService;
// {mutation SingleUpload($file: Upload!) {
//   singleUpload(file: $file) {
//     message
//   }
// }
// {"query":"mutation SingleUpload($file:Upload!) {\n  singleUpload(file: $file)\n { message}}"}
