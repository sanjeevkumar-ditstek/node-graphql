"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReader = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const joiErrorHandler_1 = require("./joiErrorHandler");
const JoiValidate_1 = require("./JoiValidate");
const schema_1 = require("../utils/joiSchema/schema");
const path_1 = require("path");
const fileReader = async (file) => {
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
        const joiErr = (0, joiErrorHandler_1.JoiError)(error);
        return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), "unknown");
    }
    name = `single${Math.floor(Math.random() * 10000 + 1)}`;
    let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
    const imageStream = await createReadStream(url);
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL;
    const port = process.env.PORT;
    url = `${baseUrl}:${port}/${url.split("Upload")[1]}`;
    return url;
};
exports.fileReader = fileReader;
const getFileSize = async (encoding, createReadStreamFunc) => {
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
