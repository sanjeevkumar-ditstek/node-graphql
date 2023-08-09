import {
  Role as IROLE,
  UpdateRole as IUPDATEROLE,
} from "../../utils/interface/IRole";
import { IResponse, dbError } from "../../utils/interface/common";
import { Request } from "express";

export interface IRoleServiceAPI {
  create(payload: ICreateRolePayload): Promise<IResponse | any>;
  getRoles(): Promise<IResponse | any>;
  getRole(payload: IGetRolePayload): Promise<IResponse | any>;
  deleteRole(request: IDeleteRolePayload): Promise<IResponse | any>;
  updateRole(payload: IUpdateRolePayload): Promise<IResponse | any>;
  getByName(paylaod: IgetRoleByNamePayload): Promise<IResponse | any>;
}

export interface ICreateRolePayload {
  data: IROLE
}
export interface ICreateRoleResponse extends IResponse {
  role?: IROLE;
}

export interface IgetRoleByNamePayload {
  name: string;
}
export interface IgetRoleByNameResponse extends IResponse {
  role?: IROLE;
}

export interface IUpdateRolePayload {
  id: string;
  data: IUPDATEROLE;
}

export interface IUpdateRoleResponse extends IResponse {
  role?: IUPDATEROLE;
}

export interface IGetRoleRequest extends Request {
  params: {
    id: string;
  };
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
  id: string;
}
export interface IDeleteRoleResponse extends IResponse {
  role?: IROLE;
}

export interface IRoleDbResponse {
  role?: IROLE | null;
  error?: dbError;
}

export interface IGetRoleListDbResponse {
  roles?: IROLE[] | null;
  error?: dbError;
}
