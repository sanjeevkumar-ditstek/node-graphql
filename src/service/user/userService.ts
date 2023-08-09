import UserStore from "./userStore";
import { User as IUSER } from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IRoleService from "../role/IRoleService";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { IResponse, dbError, toError } from "../../utils/interface/common";
import { apiResponse } from "../../helper/apiResonse";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import dotenv from 'dotenv';
import { JoiValidate } from "../../helper/JoiValidate";
import {
  getUserSchema,
  loginSchema,
  userCreateSchema,
  userUpdateSchema,
} from "../../utils/joiSchema/schema";
import { JoiError } from "../../helper/joiErrorHandler";
import { ApolloError } from "apollo-server-express";
// dotenv.config();

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

  public create = async (
    payload: IUserService.IRegisterUserPayload
  ): Promise<IResponse | any> => {
    // try{
    const { error, value } = JoiValidate(userCreateSchema, payload);
    if (error) {
      console.error(error);
      const joiErr = JoiError(error);
      return new ApolloError(JSON.stringify(joiErr), "unknown");
    }
    const { firstname, lastname, email, password, age, role } = value;
    // Check if email is already registered...
    let existingUser: IUserService.IUserDbResponse;
    try {
      existingUser = await this.userStore.getByEmail(email);
      //Error if email id is already exist
      if (existingUser && existingUser?.user?.email) {
        const Error: dbError = {
          message: ErrorMessageEnum.EMAIL_ALREADY_EXIST,
        };
        return apiResponse(null, Error);
      }
    } catch (e) {
      console.error(e);
      return apiResponse(null, e);
    }
    const roleResponse: IRoleService.IgetRoleByNameResponse =
      await this.proxy.role.getByName({ name: role });
    if (roleResponse.error) {
      return roleResponse;
    }

    let result: IUserService.IUserDbResponse;
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const attributes: IUSER = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        age,
        role: roleResponse.data?._id ? roleResponse.data?._id : "",
      };
      result = await this.userStore.createUser(attributes);

      if (result.error) {
        console.log(result.error);
        return apiResponse(null, result.error);
      }
      return apiResponse(result.user, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  public updateUser = async (
    payload: IUserService.IUpdateUserPayload
  ): Promise<IResponse | any> => {
    const { id, data } = payload;
    const result = JoiValidate(getUserSchema, { id });
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }
    const { error, value } = JoiValidate(userUpdateSchema, { ...data });
    if (error) {
      console.error(error);
      return apiResponse(null, error);
    }
    if (data.role) {
      const roleResponse: IRoleService.IgetRoleByNameResponse =
        await this.proxy.role.getByName({ name: data.role });
      if (roleResponse.error) {
        return roleResponse;
      }
    }
    let existingUser: IUserService.IUserDbResponse;
    try {
      existingUser = await this.userStore.getById(id);
      if (existingUser.error) {
        return apiResponse(null, existingUser.error);
      }
      if (!existingUser.user) {
        return apiResponse(null, toError(ErrorMessageEnum.USER_NOT_EXIST));
      }
      const result = await this.userStore.updateUserById(
        payload.id,
        payload.data
      );
      if (result.error) {
        return apiResponse(null, result.error);
      }
      return apiResponse(result.user, null);
    } catch (e) {
      console.error(e);
      return apiResponse(null, e);
    }
  };

  public deleteUser = async (
    payload: IUserService.IDeleteUserPayload
  ): Promise<IResponse | any> => {
    const { id } = payload;
    const result = JoiValidate(getUserSchema, payload);
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }
    let existingUser: IUserService.IUserDbResponse;
    try {
      existingUser = await this.userStore.getById(id);
      if(existingUser.error){
        return apiResponse(null, existingUser.error);
      }
      if (!existingUser.user) {
        return apiResponse(null, toError(ErrorMessageEnum.USER_NOT_EXIST));
      }
      const result = await this.userStore.deleteUserById(id);
      if (result.error) {
        return apiResponse(null, result.error);
      }
      return apiResponse(result.user, null);

    } catch (e) {
      return apiResponse(null, e);
    }
  };

  public getUsers = async (): Promise<IResponse | any> => {
    let result: IUserService.IGetUserListDbResponse;
    try {
      result = await this.userStore.getAll();
      if (result.error) {
        return apiResponse(null, result.error);
      }
      return apiResponse(result.users, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  public getUser = async (
    payload: IUserService.IGetUserPayload
  ): Promise<IResponse | any> => {
    let result: IUserService.IUserDbResponse;
    try {
      const resultId = JoiValidate(getUserSchema, payload);
      if (resultId.error) {
        console.error(resultId.error);
        return apiResponse([], resultId.error);
      }
      result = await this.userStore.getById(payload.id);
      if (result.error) {
        return apiResponse(null, result.error);
      }
      if (!result.user) {
        const error = new Error()
        error.message = ErrorMessageEnum.USER_NOT_EXIST
        return apiResponse(null, error);
      }
      return apiResponse(result.user, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  // loginUser
  public loginUser = async (
    payload: IUserService.ILoginPayload
  ): Promise<IResponse | any> => {
    const { email, password } = payload;
    const { error, value } = JoiValidate(loginSchema, { email , password });
    if (error) {
      console.error(error);
      return apiResponse(null, error);
    }
    let result: IUserService.IUserDbResponse;
    try {
      result = await this.userStore.getByEmail(email);
      if (result.error) {
        return apiResponse(null, result.error);
      }
      if (!result) {
        return apiResponse(null, toError(ErrorMessageEnum.USER_NOT_EXIST));
      }
      const isValid = await bcrypt.compare(
        password,
        result?.user ? result?.user?.password : ""
      );
      if (!isValid || !result.user?.password) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        return apiResponse(null,  toError(errorMsg))
      }
      const token: string = this.generateJWT(result.user);
      return apiResponse({token , id: result.user.id}, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  // forgot password

  // update password
}
