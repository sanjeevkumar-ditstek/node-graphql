/* eslint-disable no-mixed-spaces-and-tabs */
import * as IUploadFileService from "./IUploadFileService";
import { IAppServiceProxy } from "../appServiceProxy";

// import dotenv from 'dotenv';
// dotenv.config();
import { fileReader } from "../../helper/fileReader";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import ReponseMessageEnum from "../../utils/enum/responseMessage";

export default class UploadFileService
  implements IUploadFileService.IUploadFileServiceAPI
{
  // private userStore = new UserStore();
  private proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  public uploadSingleFile = async (file: any) : Promise<IUploadFileService.IFileUploadResponse>=> {
    //should return response
    const response: IUploadFileService.IFileUploadResponse = await fileReader(file);
    return response;
  };

  public uploadMultipleFile = async ({ file }: any): Promise<IUploadFileService.IFileUploadResponse> => {
    // should return response
    const response: IUploadFileService.IFileUploadResponse = {
      message: ErrorMessageEnum.FILE_INTERNAL_ERROR
    };
    for (let i = 0; i < file.length; i++) {
      const response = await fileReader(file[i]);
      if(response.error){
        return response;
      }
    }
    response.message = ReponseMessageEnum.FILES_UPLOADED;
    return response;
  };
}
