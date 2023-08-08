import { dbError } from "../../utils/interface/common";

export interface IUploadFileServiceAPI {
	uploadSingleFile(file:any): any;
	uploadMultipleFile(file:any): any;
}

export interface IFileUploadResponse {
	message: string;
	error?: dbError;
}