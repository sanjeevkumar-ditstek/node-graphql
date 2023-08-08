import UserStore from "./userStore";
import { User as IUSER } from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IRoleService from "../role/IRoleService";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { dbError, toError } from "../../utils/interface/common";
import { apiResponse } from "../../helper/apiResonse";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import dotenv from 'dotenv';
import { JoiValidate } from "../../helper/JoiValidate";
import {
  getUserSchema,
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

  public create = async (payload: IUserService.IRegisterUserPayload) => {
    // try{
    const response: IUserService.IRegisterUserResponse = {
      data: null,
    };
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
        return apiResponse(
          null,
          Error
        );
      }
    } catch (e) {
      console.error(e);
      return apiResponse(
        null,
        e
      );
    }
    const roleResponse: IRoleService.IgetRoleByNameResponse =
      await this.proxy.role.getByName({ role });
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
        role,
      };
      result = await this.userStore.createUser(attributes);

      if (result.error) {
        console.log(result.error, "error");
        return apiResponse(
          null,
          result.error
        );
      }
      return apiResponse(
        result.user,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  public updateUser = async (payload: IUserService.IUpdateUserPayload) => {
    const response: IUserService.IUpdateUserResponse = {
      data: null,
    };

    const result = JoiValidate(getUserSchema, { id: payload.id });
    if (result.error) {
      console.error(result.error);
      return apiResponse(
        {},
        result.error
      );
    }

    const { error, value } = JoiValidate(userUpdateSchema, payload.data);
    if (error) {
      console.error(error);
      return apiResponse(
        null,
        error
      );
    }

    if (payload.data.role) {
      const roleResponse: IRoleService.IgetRoleByNameResponse =
        await this.proxy.role.getByName({ role: payload.data.role });
      if (roleResponse.error) {
        return roleResponse;
      }
    }

    let existingUser: IUserService.IUserDbResponse;
    try {
      existingUser = await this.userStore.getById(payload.id);
      if (!existingUser) {
        return apiResponse(
          null,
          toError(ErrorMessageEnum.USER_NOT_EXIST)
        );
      }
    } catch (e) {
      console.error(e);
      return apiResponse(
        null,
        e
      );
    }
    try {
      const result = await this.userStore.updateUserById(
        payload.id,
        payload.data
      );
      return apiResponse(
        result.user,
        null
      );
    } catch (e) {
      console.error(e);
      return apiResponse(
        null,
        e
      );
    }
  };

  public deleteUser = async (payload: IUserService.IDeleteUserPayload) => {
    const { id } = payload;
    const response: IUserService.IDeleteUserResponse = {
      data: null,
    };

    const result = JoiValidate(getUserSchema, payload);
    if (result.error) {
      console.error(result.error);
      return apiResponse(
        {},
        result.error
      );
    }

    let existingUser: IUserService.IUserDbResponse;
    try {
      existingUser = await this.userStore.getById(id);
      if (!existingUser) {
        return apiResponse(
          null,
          toError(ErrorMessageEnum.USER_NOT_EXIST)
        );
      }
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
    try {
      const result = await this.userStore.deleteUserById(id);
      return apiResponse(
        result.user,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  public getUsers = async () => {
    const response: IUserService.IGetAllUserResponse = {
      data: null,
    };
    let result: IUserService.IGetUserListDbResponse;
    try {
      result = await this.userStore.getAll();
      return apiResponse(
        result.users,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  public getUser = async (payload: IUserService.IGetUserPayload) => {
    let result: IUserService.IUserDbResponse;
    try {
      const resultId = JoiValidate(getUserSchema, payload);
      if (resultId.error) {
        console.error(resultId.error);
        return apiResponse(
          [],
          resultId.error
        );
      }
      result = await this.userStore.getById(payload.id);
      return apiResponse(
        result.user,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  // loginUser
  public loginUser = async (payload: IUserService.ILoginPayload) => {
    const { email, password } = payload;
    const response: IUserService.ILoginResponse = {
      data: null,
    };
    let result: IUserService.IUserDbResponse;
    try {
      result = await this.userStore.getByEmail(payload.email);
      if (!result) {
        return apiResponse(
          null,
          toError(ErrorMessageEnum.USER_NOT_EXIST)
        );
      }
      const isValid = await bcrypt.compare(
        password,
        result?.user ? result?.user?.password : ""
      );
      if (!isValid || !result.user?.password) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
      
        response.error = toError(errorMsg);
        return response;
      }
      
      response.token = this.generateJWT(result.user);
      response.user = result.user;
      return apiResponse(
        response,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  // forgot password

  // update password
}
