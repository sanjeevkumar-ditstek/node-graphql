import Joi from "joi";
import UserStore from "./userStore";
import { User as IUSER } from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
// import * as IRoleService from "../role/IRoleService";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { dbError, toError } from "../../utils/interface/common";
import { apiResponse } from "../../helper/apiResonse";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { handleDbError } from "../../helper/handleDbError";
import { JoiValidate } from "../../helper/JoiValidate";
import { userCreateSchema } from "../../utils/joiSchema/schema";
import { JoiError } from "../../helper/joiErrorHandler";
import { ApolloError } from "apollo-server-express";
dotenv.config();

export default class UserService implements IUserService.IUserServiceAPI {
	private userStore = new UserStore();
	private proxy: IAppServiceProxy;

	constructor(proxy: IAppServiceProxy) {
		this.proxy = proxy;
	}
	private generateJWT = (user: IUSER): string => {
		const payLoad = {
			id: user.id,
			email: user.email,
		};
		return jwt.sign(payLoad, "process.env.JWT_SECRET");
	};

	public create = async (payload: IUserService.IRegisterUserPayload) => {
		// try{
		const response: IUserService.IRegisterUserResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			status: false,
			data: null,
			message: ""
		};
		const {error , value} = JoiValidate(userCreateSchema , payload)
		if (error) {
			console.error(error);
			const joiErr = JoiError(error)
			// return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, joiErr);
			return new ApolloError(JSON.stringify(joiErr) ,'unknown');
		}
		const { firstname, lastname, email, password, age } = value;
		// Check if email is already registered...
		let existingUser: IUserService.IUserDbResponse;
		try {
			existingUser = (await this.userStore.getByEmail(email))
			//Error if email id is already exist
			if (existingUser && existingUser?.user?.email) {
			const Error: dbError =	 {message: ErrorMessageEnum.EMAIL_ALREADY_EXIST};
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.EMAIL_ALREADY_EXIST, null, false,Error );
			}
		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, e);
		}

		// let rolePayload: IRoleService.IgetRoleByNamePayload = { role };
		// let roleResponse: IRoleService.IgetRoleByNameResponse = await this.proxy.role.getByName(rolePayload);

		// if (roleResponse.statusCode !== STATUS_CODES.OK) {
		// 	return roleResponse;
		// }
		let result: IUserService.IUserDbResponse;
		try {
			const hashPassword = await bcrypt.hash(password, 10);
			const attributes: IUSER = {
				firstname,
				lastname,
				email: email.toLowerCase(),
				password: hashPassword,
				age,
				// role: roleRe_idsponse.data.
			};
			result = await this.userStore.createUser(attributes);
			
			if(result.error){
				console.log(result.error , "error")
					return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, result.error)
			}
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_CREATED, result.user, true, null)
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	}
	
	public updateUser = async (payload: IUserService.IUpdateUserPayload) => {
		const response: IUserService.IUpdateUserResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: responseMessage.INVALID_EMAIL_OR_CODE,
			data: null,
			status: false
		};
		const {error , value} = JoiValidate(userCreateSchema , payload)
		if (error) {
			console.error(error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, error);
		}
		let existingUser: IUserService.IUserDbResponse;
		try {
			existingUser = await this.userStore.getById(payload.id);
			if (!existingUser) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.USER_NOT_EXIST, null, false, toError(ErrorMessageEnum.USER_NOT_EXIST));
			}
		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
		try {
			const result = await this.userStore.updateUserById(payload.id, payload.data)
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_UPDATED, result.user, true, null)
		}
		catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public deleteUser = async (payload: IUserService.IDeleteUserPayload) => {
		const { id } = payload;
		const response: IUserService.IDeleteUserResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: responseMessage.INVALID_EMAIL_OR_CODE,
			data: null,
			status: false
		};
		let existingUser: IUserService.IUserDbResponse;
		try {
			existingUser = await this.userStore.getById(id);
			if (!existingUser) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.USER_NOT_EXIST, null, false, toError(ErrorMessageEnum.USER_NOT_EXIST));
			}
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
		try {
			const result = await this.userStore.deleteUserById(id);
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_DELETED, result.user, true, null)
		}
		catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public getUsers = async () => {
		const response: IUserService.IGetAllUserResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: responseMessage.INVALID_EMAIL_OR_CODE,
			data: null,
			status: false
		};
		let result: IUserService.IGetUserListDbResponse;
		console.log("i m herge")
		try {
			result = await this.userStore.getAll();
			return apiResponse(STATUS_CODES.OK, responseMessage.USERS_FETCHED, result.users, true, null);
		} catch (e) {

			console.log(e, "eeee")
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public getUser = async (payload: IUserService.IGetUserPayload) => {
		let result: IUserService.IUserDbResponse;
		try {
			result = await this.userStore.getById(payload.id);
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_FETCHED, result.user, true, null);
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	// loginUser
	public loginUser = async (payload: IUserService.ILoginPayload) => {
		const { email, password } = payload;
		const response: IUserService.ILoginResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: responseMessage.INVALID_EMAIL_OR_CODE,
			data: null,
			status: false
		};
		let result: IUserService.IUserDbResponse;
		try {
			result = await this.userStore.getByEmail(payload.email);
			if (!result) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.USER_NOT_EXIST, null, false, toError(ErrorMessageEnum.USER_NOT_EXIST));
			}
			const isValid = await bcrypt.compare(password, result?.user ? result?.user?.password: "" );
			if (!isValid || !result.user?.password) {
				const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
				response.statusCode = STATUS_CODES.UNAUTHORIZED;
				response.error = toError(errorMsg);
				return response;
			}
			response.statusCode = STATUS_CODES.OK;
			response.token = this.generateJWT(result.user);
			response.user = result.user;
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_FETCHED, response, true, null);
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};
}
