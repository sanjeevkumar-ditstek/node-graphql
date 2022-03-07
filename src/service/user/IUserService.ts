/* eslint-disable @typescript-eslint/no-explicit-any */
import IUser from "./IUser";
import { IRequest, IResponse } from "../../utils/enum/common";
import { Role } from "../../utils/enum/role";
export interface IUserServiceAPI {
    register(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
    login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
    get(request: IGetUserRequest): Promise<IGetUserResponse>;
}

/********************************************************************************
 *  Authentication
 ********************************************************************************/

export interface IAuthenticateUserResponse extends IResponse {
    user?: IUser;
    token?: string;
}

export interface IRegisterUserRequest extends IRequest {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
}
export interface IRegisterUserResponse extends IResponse {
    status?:any;
    error?: any;
    user?: IUser;
}

/********************************************************************************
 *  Login
 ********************************************************************************/

export interface ILoginUserRequest extends IRequest {
    email: string;
    password: string;
}

export interface ILoginUserResponse extends IResponse {
    user?: IUser;
    error?: any;
    token?: string;
    message?: string;
}

/********************************************************************************
 *  Verify email
 ********************************************************************************/

export interface IVerifyUserEmailRequest extends IRequest {
    email: string;
}
export interface IVerifyUserEmailResponse extends IResponse {
    user?: IUser;
    error?: any;
}

/********************************************************************************
 *  Get User
 ********************************************************************************/

export interface IGetUserRequest extends IRequest {
    returnUser?: IUser;
    user?: IUser;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    role?: Role;
}

export interface IGetUserResponse extends IResponse {
	// newimg?: any;
    user?: IUser;
    error?: any;
}

/********************************************************************************
 *  Get Users
 ********************************************************************************/

export interface IGetUsersRequest extends IRequest {
    user?:IUser;
}
export interface IGetUsersResponse extends IResponse {
    user?: IUser;
    error?: any;
}