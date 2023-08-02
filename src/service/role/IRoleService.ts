import { Role as IROLE, UpdateRole as IUPDATEROLE } from "../../utils/interface/IRole";
import { IResponse } from "../../utils/interface/common";
import { Request } from "express";

export interface IRoleServiceAPI {
	create(payload: ICreateRolePayload): any;
	getRoles(): any;
	getRole(payload: IGetRolePayload): any;
	deleteRole(request: IDeleteRolePayload): any;
	updateRole(payload: IUpdateRolePayload): any;
	getByName(paylaod: IgetRoleByNamePayload): any
}

export interface ICreateRolePayload {
	role: string;
}
export interface ICreateRoleResponse extends IResponse {
	role?: IROLE;
}

export interface IgetRoleByNamePayload {
	role: string;
}
export interface IgetRoleByNameResponse extends IResponse {
	role?: IROLE;
}

export interface IUpdateRolePayload {
	id: string,
	data: IUPDATEROLE
}

export interface IUpdateRoleResponse extends IResponse {
	role?: IUPDATEROLE;
}

export interface IGetRoleRequest extends Request {
	params: {
		id: string;
	}
}
export interface IGetRoleResponse extends IResponse {
	role?: IROLE;
}

// export interface IGetAllRoleRequest extends Request {
// }
export interface IGetAllRoleResponse extends IResponse {
	roles?: IROLE[];
}
export interface IGetRolePayload {
	id: string;
}
export interface IRoleResponse extends IResponse {
	roles?: IROLE;
}

export interface IDeleteRolePayload extends Request {
	id: string
}
export interface IDeleteRoleResponse extends IResponse {
	role?: IROLE;
}
