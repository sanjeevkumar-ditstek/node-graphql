/* eslint-disable no-mixed-spaces-and-tabs */
import * as IUploadFileService from "./IUploadFileService";
import { IAppServiceProxy } from "../appServiceProxy";

// import dotenv from 'dotenv';
// dotenv.config();
import { fileReader } from "../../helper/fileReader";

export default class UploadFileService
  implements IUploadFileService.IUploadFileServiceAPI
{
  // private userStore = new UserStore();
  private proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  public uploadSingleFile = async (file: any) => {
    //should return response
    const url: string | any = await fileReader(file);
    return url;
  };

  public uploadMultipleFile = async ({ file }: any) => {
    // should return response
    const fileUrl = [];
    for (let i = 0; i < file.length; i++) {
      const url: string | any = await fileReader(file[i]);
      fileUrl.push({ url });
    }
    return fileUrl;
  };
}
