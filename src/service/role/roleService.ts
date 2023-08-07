import Joi from "joi";
import RoleStore from "./roleStore";
import { Role as IROLE } from "../../utils/interface/IRole";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IRoleService from "./IRoleService";
import { IAppServiceProxy } from "../appServiceProxy";
import { dbError, toError } from "../../utils/interface/common";
import { apiResponse } from "../../helper/apiResonse";
import dotenv from 'dotenv';
import { JoiValidate } from "../../helper/JoiValidate";
import { getRoleSchema, roleSchema } from "../../utils/joiSchema/schema";
import { JoiError } from "../../helper/joiErrorHandler";
import { ApolloError } from "apollo-server-express";
dotenv.config();

export default class RoleService implements IRoleService.IRoleServiceAPI {
	private roleStore = new RoleStore();
	private proxy: IAppServiceProxy;
	constructor(proxy: IAppServiceProxy) {
		this.proxy = proxy;
	}
	public create = async (payload: IRoleService.ICreateRolePayload) => {
		const response: IRoleService.ICreateRoleResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			status: false,
			data: null,
			message: ""
		};
		const {error , value} = JoiValidate(roleSchema , payload)
		if (error) {
			console.error(error);
			const joiErr = JoiError(error)
			return new ApolloError(JSON.stringify(joiErr) ,'unknown');
		}
		const { name } = payload;
		let existingRole: IRoleService.IRoleDbResponse;
		try {
			existingRole = await this.roleStore.getByName(name);
            if(existingRole.error){
                return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INVALID_CREDENTIALS, null, false, existingRole.error);
            }
			if (existingRole && existingRole?.role?.name === name) {
                const Error: dbError =	 {message: ErrorMessageEnum.ROLE_ALREADY_EXIST};
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_ALREADY_EXIST, null, false,Error );
			}
		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, {}, false, e);
		}
		let resultRole: IRoleService.IRoleDbResponse;
		try {
			resultRole = await this.roleStore.createRole({ name });
            if(resultRole.error){
                return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.INVALID_CREDENTIALS, {}, true, resultRole.error)
            }
			return apiResponse(STATUS_CODES.OK, responseMessage.USER_CREATED, resultRole.role, true, null)
		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public getRoles = async () => {
		const response: IRoleService.IGetAllRoleResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			status: false,
			data: null,
			message: ""
		};

		let rolesResult: IRoleService.IGetRoleListDbResponse;
		try {
			rolesResult = await this.roleStore.getAll();
			return apiResponse(STATUS_CODES.OK, responseMessage.ROLES_FETCHED, rolesResult.roles, true, null);
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	}

	public getRole = async (payload: IRoleService.IGetRolePayload) => {
		const response: IRoleService.IGetRoleResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			status: false,
			data: null,
			message: ""
		};

        const result = JoiValidate(getRoleSchema , {id: payload.id})
		if (result.error) {
			console.error(result.error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, {}, false, result.error);
		}

		let resultRole: IRoleService.IRoleDbResponse;
		try {
			resultRole = await this.roleStore.getById(payload.id);
			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_FETCHED, resultRole.role, true, null);
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public getByName = async (payload: IRoleService.IgetRoleByNamePayload) => {
		const response: IRoleService.IgetRoleByNameResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			status: false,
			data: null,
			message: ""
		};
		const schema = Joi.object().keys({
			name: Joi.string().required(),
		});
		const params = schema.validate(payload);
		if (params.error) {
			console.error(params.error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, params.error);
		}
		const { role } = payload;
		// Check if email is already registered
		let existingRole: IRoleService.IRoleDbResponse;
		try {
			existingRole = await this.roleStore.getByName(role);
			//Error if email id is already exist
			if (!existingRole) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, [], false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
			}

		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, (e));
		}
		return apiResponse(STATUS_CODES.OK, responseMessage.USER_CREATED, existingRole, true, null)
	}

	public updateRole = async (payload: IRoleService.IUpdateRolePayload) => {
		const response: IRoleService.IUpdateRoleResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: "null",
			data: null,
			status: false
		};

        const result = JoiValidate(getRoleSchema , {id: payload.id})
		if (result.error) {
			console.error(result.error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, {}, false, result.error);
		}
		const updateSchemaResult = JoiValidate(roleSchema , {id: payload.id})
		if (updateSchemaResult.error) {
			console.error(updateSchemaResult.error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, {}, false, updateSchemaResult.error);
		}


		let existingRole: IRoleService.IRoleDbResponse;
		try {
			existingRole = await this.roleStore.getById(payload.id);
			if (!existingRole) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, null, false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
			}
		} catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, (e));
		}
		try {
			const result = await this.roleStore.updateRoleById(payload.id, payload.data)
			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_UPDATED, result.role, true, null)
		}
		catch (e) {
			console.error(e);
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, e);
		}
	};

	public deleteRole = async (payload: IRoleService.IDeleteRolePayload) => {
		const { id } = payload;
		const response: IRoleService.IDeleteRoleResponse = {
			statusCode: STATUS_CODES.UNKNOWN_CODE,
			message: "",
			data: null,
			status: false
		};

        const result = JoiValidate(getRoleSchema , {id: payload.id})
		if (result.error) {
			console.error(result.error);
			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, {}, false, result.error);
		}


		let existingRole: IRoleService.IRoleDbResponse;
		try {
			existingRole = await this.roleStore.getById(id);
			if (!existingRole) {
				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, null, false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
			}
		} catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, (e));
		}
		try {
			const result: IRoleService.IRoleDbResponse = await this.roleStore.deleteRoleById(id);
			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_DELETED, result.role, true, null)
		}
		catch (e) {
			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, (e));
		}
	};
}
