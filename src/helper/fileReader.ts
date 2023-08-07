import { ApolloError } from "apollo-server-express";
import { JoiError } from "./joiErrorHandler";
import { JoiValidate } from "./JoiValidate";
import { fileSchema } from "../utils/joiSchema/schema";
import { parse } from "path";

export const fileReader = async (file: any) => {
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
    const joiErr = JoiError(error);
    return new ApolloError(JSON.stringify(joiErr), "unknown");
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

const getFileSize = async (encoding: any, createReadStreamFunc: any) => {
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
