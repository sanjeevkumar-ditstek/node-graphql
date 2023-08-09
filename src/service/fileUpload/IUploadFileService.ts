import { dbError } from "../../utils/interface/common";

export interface IUploadFileServiceAPI {
	uploadSingleFile(file:any): Promise<IFileUploadResponse>;
	uploadMultipleFile(file:any): Promise<IFileUploadResponse>;
}

export interface IFileUploadResponse {
	message: string;
	error?: dbError;
}