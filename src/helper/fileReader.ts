import { ApolloError } from "apollo-server-express";
import { JoiError } from "./joiErrorHandler";
import { JoiValidate } from "./JoiValidate";
import { fileSchema } from "../utils/joiSchema/schema";
import fs from'fs';
import { parse } from "path";
import * as IUploadFileService from "../service/fileUpload/IUploadFileService";
import STATUS_CODES from "../utils/enum/statusCodes";
import ErrorMessageEnum from "../utils/enum/errorMessage";
import ReponseMessageEnum from "../utils/enum/responseMessage";

export const fileReader = async (file: any) => {
  const fileReaderResponse: IUploadFileService.IFileUploadResponse = {
    message: ErrorMessageEnum.FILE_INTERNAL_ERROR,
    error: {
      message: ErrorMessageEnum.FILE_INTERNAL_ERROR,
      code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
    },
  };
  try {
    const { createReadStream, filename, encoding, mimetype } = await file;
    const fileSize = 1;
    // await this.getFileSize(encoding, createReadStream);
    const stream = createReadStream();
    const { ext } = parse(filename);
    let { name } = parse(filename);
    const { error, value } = JoiValidate(fileSchema, {
      fileExtension: ext,
      size: fileSize,
      mimetype,
    });
    if (error) {
      console.error(error);
      fileReaderResponse.error = {
        message: JSON.stringify(error),
        code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
      };
      return fileReaderResponse;
    }
    name = `single${Math.floor(Math.random() * 10000 + 1)}`;
    let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
    const imageStream = await fs.createWriteStream(url);
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL;
    const port = process.env.PORT;
    url = `${baseUrl}:${port}/${url.split("upload")[1]}`;
    fileReaderResponse.message = ReponseMessageEnum.FILE_UPLOADED;
    fileReaderResponse.error = undefined;
    return fileReaderResponse;
  } catch (error) {
    console.error(error);
    fileReaderResponse.error = { message: JSON.stringify(error), code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString() };
    return fileReaderResponse;
  }
};

const getFileSize = async (encoding: any, createReadStreamFunc: any) => {
  return new Promise((reject, resolve) => {
    try {
      let fileSize = 0;
      const readStream = createReadStreamFunc();
      readStream.on("data", (chunk: any) => {
        fileSize += Buffer.byteLength(chunk, encoding);
      });
      readStream.on("end", () => {
        resolve(fileSize);
      });
      readStream.on("error", (err: any) => {
        reject(err);
      });
    } catch (e) {
      reject(e);
    }
  });
};
