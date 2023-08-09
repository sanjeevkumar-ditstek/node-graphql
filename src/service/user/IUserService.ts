import {
  User as IUSER,
  UpdateUser as IUPDATEUSER,
} from "../../utils/interface/IUser";
import { IResponse, dbError } from "../../utils/interface/common";
import { Request } from "express";

export interface IUserServiceAPI {
  create(payload: IRegisterUserPayload): Promise<IResponse | any>;
  getUsers(): Promise<IResponse | any>;
  getUser(payload: IGetUserPayload): Promise<IResponse | any>;
  deleteUser(request: IDeleteUserPayload): Promise<IResponse | any>;
  updateUser(payload: IUpdateUserPayload): Promise<IResponse | any>;
  loginUser(payload: ILoginPayload): Promise<IResponse | any>;
}

export interface IRegisterUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  age: number;
  role: string;
}
export interface IRegisterUserArgsPayload {
  data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    age: number;
    role: string;
  };
}

export interface IUpdateUserPayload {
  id: string;
  data: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    age?: number;
    role?: string;
  };
}

export interface IRegisterUserResponse extends IResponse {
  user?: IUSER;
}

export interface IUpdateUserResponse extends IResponse {
  user?: IUPDATEUSER;
}

export interface IGetUserRequest extends Request {
  params: {
    id: string;
  };
}
export interface IGetUserResponse extends IResponse {
  user?: IUSER;
}

export interface IGetAllUserResponse extends IResponse {
  users?: IUSER[];
}
export interface IGetUserArgsPayload {
  id: string;
}
export interface IGetUserPayload {
  id: string;
}
export interface IGetUserResponse extends IResponse {
  users?: IUSER;
}

export interface IDeleteUserPayload extends Request {
  id: string;
}
export interface IDeleteUserResponse extends IResponse {
  user?: IUSER;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse extends IResponse {
  token?: string;
  user?: IUSER;
}

export interface ILogsPayload {
  oldData: [IUSER];
  newData: [IUSER];
}

export interface ILogsResponse extends IResponse {
  usersLogs?: [IUSER];
}

export interface IUserDbResponse {
  user?: IUSER | null;
  error?: dbError;
}

export interface IGetUserListDbResponse {
  users?: IUSER[] | null;
  error?: dbError;
}

export interface IUpdateUserDbResponse {
  user?: IUPDATEUSER | null;
  error?: dbError;
}
