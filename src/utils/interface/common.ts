import StatusCodeEnum from "../enum/statusCodes";
import ErrorMessageEnum from "../enum/errorMessage";

export interface IResponse {
	error?: IError;
	data: any
	
}

export interface IError {
	message?: any;
}

export interface dbError{
	message?: string,
	code?: string,
}

export interface AuthResponse{
	data :{id: string,
	email: string} | undefined,
	error: string | undefined

}

export function joiToError(joiError: any): IError {
	let message = "There was an error processing your request. Please contact support.";
	if (joiError && joiError.details && joiError.details[0]) {
		message = joiError.details[0].message;
	} else {	
		message = joiError.message;
	}

	const error: IError = {
		message,
	};

	return error;
}

export function toError(message: string): IError {
	const error: IError = {
		message,
	};

	return error;
}
