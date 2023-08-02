/* eslint-disable no-mixed-spaces-and-tabs */
import * as IUploadFileService from "./IUploadFileService";
import { IAppServiceProxy } from "../appServiceProxy";
import dotenv from 'dotenv';
import path from"path";
import {parse, join}  from "path"; // This is node built in package
import {createWriteStream} from "fs"; // this is node built in package
import fs from "fs"; // this is node built in package
import { JoiValidate } from "../../helper/JoiValidate";
import { fileSchema } from "../../utils/joiSchema/schema";
import { JoiError } from "../../helper/joiErrorHandler";
import { ApolloError } from "apollo-server-express";
import { Console } from "winston/lib/winston/transports";
dotenv.config();

export default class UploadFileService implements IUploadFileService.IUploadFileServiceAPI {
  // private userStore = new UserStore();
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  public uploadSingleFile = async (file: any) => {
    const { createReadStream, filename, encoding, mimetype } = await file;
    const fileSize = 1
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
      const joiErr = JoiError(error);
      return new ApolloError(JSON.stringify(joiErr), "unknown");
    }

    name = `single${Math.floor(Math.random() * 10000 + 1)}`;
    let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
    const imageStream = await createWriteStream(url);
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL;
    const port = process.env.PORT;
    url = `${baseUrl}:${port}/${url.split("Upload")[1]}`;
    return url;
  };

  public uploadMultipleFile = async ({file}:any) => {
    //
    const fileUrl = [];
    for (let i = 0; i < file.length; i++) {
        const {createReadStream, filename, encoding, mimetype} = await file[i];
        const fileSize = 1
        const stream = createReadStream();
        const {ext} = parse(filename);
        let {name} = parse(filename);
        name = `single${Math.floor((Math.random() * 10000) + 1)}`;
        let url = `${process.env.UPLOAD_PATH}${name}-${Date.now()}${ext}`;
        const imageStream = await createWriteStream(url)
        await stream.pipe(imageStream);
        const baseUrl = process.env.BASE_URL;
        const port = process.env.PORT;
        url = `${baseUrl}${port}${url.split('Upload')[1]}`;
        fileUrl.push({url});
    }
    return fileUrl

  };

  public getFileSize = async (
    encoding: any,
    createReadStreamFunc: any,
  ) => {
    return new Promise((reject, resolve) => {
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
    });
  };
}

