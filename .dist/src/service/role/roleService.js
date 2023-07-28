"use strict";
// import Joi from "joi";
// import RoleStore from "./roleStore";
// import { Role as IROLE } from "../../utils/interface/IRole";
// import STATUS_CODES from "../../utils/enum/statusCodes";
// import ErrorMessageEnum from "../../utils/enum/errorMessage";
// import responseMessage from "../../utils/enum/responseMessage";
// import * as IRoleService from "./IRoleService";
// import { IAppServiceProxy } from "../appServiceProxy";
// import { toError } from "../../utils/interface/common";
// import { apiResponse } from "../../helper/apiResonse";
// import dotenv from 'dotenv';
// dotenv.config();
// export default class RoleService implements IRoleService.IRoleServiceAPI {
// 	private roleStore = new RoleStore();
// 	private proxy: IAppServiceProxy;
// 	constructor(proxy: IAppServiceProxy) {
// 		this.proxy = proxy;
// 	}
// 	public create = async (payload: IRoleService.ICreateRolePayload) => {
// 		const response: IRoleService.ICreateRoleResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			status: false,
// 			data: null,
// 			message: ""
// 		};
// 		const schema = Joi.object().keys({
// 			role: Joi.string().required(),
// 		});
// 		const params = schema.validate(payload);
// 		if (params.error) {
// 			console.error(params.error);
// 			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, params.error);
// 		}
// 		const { role } = payload;
// 		// Check if email is already registered
// 		let existingRole: IROLE;
// 		try {
// 			existingRole = await this.roleStore.getByName(role);
// 			//Error if email id is already exist
// 			if (existingRole && existingRole?.role === role) {
// 				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_ALREADY_EXIST, response, false, toError(ErrorMessageEnum.ROLE_ALREADY_EXIST));
// 			}
// 		} catch (e) {
// 			console.error(e);
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, toError(e.message));
// 		}
// 		let user: IROLE;
// 		try {
// 			user = await this.roleStore.createRole({ role: role });
// 			return apiResponse(STATUS_CODES.OK, responseMessage.USER_CREATED, user, true, null)
// 		} catch (e) {
// 			console.error(e);
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 	};
// 	public getRoles = async () => {
// 		const response: IRoleService.IGetAllRoleResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			status: false,
// 			data: null,
// 			message: ""
// 		};
// 		let roles: IROLE[];
// 		try {
// 			roles = await this.roleStore.getAll();
// 			return apiResponse(STATUS_CODES.OK, responseMessage.ROLES_FETCHED, roles, true, null);
// 		} catch (e) {
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 	}
// 	public getRole = async (payload: IRoleService.IGetRolePayload) => {
// 		const response: IRoleService.IGetRoleResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			status: false,
// 			data: null,
// 			message: ""
// 		};
// 		let role: IROLE;
// 		try {
// 			role = await this.roleStore.getById(payload.id);
// 			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_FETCHED, role, true, null);
// 		} catch (e) {
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 	};
// 	public getByName = async (payload: IRoleService.IgetRoleByNamePayload) => {
// 		const response: IRoleService.IgetRoleByNameResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			status: false,
// 			data: null,
// 			message: ""
// 		};
// 		const schema = Joi.object().keys({
// 			role: Joi.string().required(),
// 		});
// 		const params = schema.validate(payload);
// 		if (params.error) {
// 			console.error(params.error);
// 			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, params.error);
// 		}
// 		console.log(payload, "roles apyload....")
// 		const { role } = payload;
// 		// Check if email is already registered
// 		let existingRole: IROLE;
// 		try {
// 			existingRole = await this.roleStore.getByName(role);
// 			//Error if email id is already exist
// 			if (!existingRole) {
// 				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, response, false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
// 			}
// 		} catch (e) {
// 			console.error(e);
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, toError(e.message));
// 		}
// 		return apiResponse(STATUS_CODES.OK, responseMessage.USER_CREATED, existingRole, true, null)
// 	}
// 	public updateRole = async (payload: IRoleService.IUpdateRolePayload) => {
// 		const response: IRoleService.IUpdateRoleResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			message: null,
// 			data: null,
// 			status: false
// 		};
// 		const schema = Joi.object().keys({
// 			role: Joi.string().required(),
// 		});
// 		const params = schema.validate(payload.data);
// 		if (params.error) {
// 			console.error(params.error);
// 			return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, params.error);
// 		}
// 		let existingRole: IROLE;
// 		try {
// 			existingRole = await this.roleStore.getById(payload.id);
// 			if (!existingRole) {
// 				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, null, false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
// 			}
// 		} catch (e) {
// 			console.error(e);
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 		try {
// 			let result = await this.roleStore.updateRoleById(payload.id, payload.data)
// 			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_UPDATED, result, true, null)
// 		}
// 		catch (e) {
// 			console.error(e);
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 	};
// 	public deleteRole = async (payload: IRoleService.IDeleteRolePayload) => {
// 		let { id } = payload;
// 		const response: IRoleService.IDeleteRoleResponse = {
// 			statusCode: STATUS_CODES.UNKNOWN_CODE,
// 			message: null,
// 			data: null,
// 			status: false
// 		};
// 		let existingRole: IROLE;
// 		try {
// 			existingRole = await this.roleStore.getById(id);
// 			if (!existingRole) {
// 				return apiResponse(STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.ROLE_NOT_EXIST, null, false, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
// 			}
// 		} catch (e) {
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 		try {
// 			let result = await this.roleStore.deleteRoleById(id);
// 			return apiResponse(STATUS_CODES.OK, responseMessage.ROLE_DELETED, result, true, null)
// 		}
// 		catch (e) {
// 			return apiResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, null, false, toError(e.message));
// 		}
// 	};
// }
