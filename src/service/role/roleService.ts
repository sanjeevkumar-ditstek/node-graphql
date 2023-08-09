import Joi from "joi";
import RoleStore from "./roleStore";
import { Role as IROLE } from "../../utils/interface/IRole";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IRoleService from "./IRoleService";
import { IAppServiceProxy } from "../appServiceProxy";
import { IResponse, dbError, toError } from "../../utils/interface/common";
import { apiResponse } from "../../helper/apiResonse";
import dotenv from "dotenv";
import { JoiValidate } from "../../helper/JoiValidate";
import {
  getRoleByNameSchema,
  getRoleSchema,
  roleSchema,
} from "../../utils/joiSchema/schema";
import { JoiError } from "../../helper/joiErrorHandler";
import { ApolloError } from "apollo-server-express";
dotenv.config();

export default class RoleService implements IRoleService.IRoleServiceAPI {
  private roleStore = new RoleStore();
  private proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }
  public create = async (
    payload: IRoleService.ICreateRolePayload
  ): Promise<IResponse | any> => {
    const { error, value } = JoiValidate(roleSchema, payload.data);
    if (error) {
      console.error(error);
      const joiErr = JoiError(error);
      return new ApolloError(JSON.stringify(joiErr), ErrorMessageEnum.UNKNOWN);
    }
    const { name } = payload.data;
    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getByName(name);
      if (existingRole.error) {
        return apiResponse(null, existingRole.error);
      }
      if (existingRole && existingRole?.role?.name) {
        const Error: dbError = { message: ErrorMessageEnum.ROLE_ALREADY_EXIST };
        return apiResponse(null, Error);
      }
      const resultRole: IRoleService.IRoleDbResponse =
        await this.roleStore.createRole(value);
      if (resultRole.error) {
        return apiResponse({}, resultRole.error);
      }
      return apiResponse(resultRole.role, null);
    } catch (e) {
      console.error(e);
      return apiResponse({}, e);
    }
  };

  public getRoles = async (): Promise<IResponse | any> => {
    let rolesResult: IRoleService.IGetRoleListDbResponse;
    try {
      rolesResult = await this.roleStore.getAll();
      if (rolesResult.error) {
        return apiResponse(null, rolesResult.error);
      }
      return apiResponse(rolesResult.roles, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  public getRole = async (
    payload: IRoleService.IGetRolePayload
  ): Promise<IResponse | any> => {
    const { id } = payload;
    const result = JoiValidate(getRoleSchema, { id });
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }
    let resultRole: IRoleService.IRoleDbResponse;
    try {
      resultRole = await this.roleStore.getById(id);
      if (resultRole.error) {
        return apiResponse(null, resultRole.error);
      }
      if(!resultRole.role){
        const error = new Error()
        error.message = ErrorMessageEnum.ROLE_NOT_EXIST
        return apiResponse(null, error);
      }
      return apiResponse(resultRole.role, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };

  public getByName = async (
    payload: IRoleService.IgetRoleByNamePayload
  ): Promise<IResponse | any> => {
    const { name } = payload;
    const result = JoiValidate(getRoleByNameSchema, { name });
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }

    // Check if email is already registered
    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getByName(name);
      //Error if email id is already exist
      if (!existingRole) {
        return apiResponse([], toError(ErrorMessageEnum.ROLE_NOT_EXIST));
      }
      if (existingRole.error) {
        return apiResponse(null, existingRole.error);
      }
    } catch (e) {
      console.error(e);
      return apiResponse(null, e);
    }
    return apiResponse(existingRole.role, null);
  };

  public updateRole = async (
    payload: IRoleService.IUpdateRolePayload
  ): Promise<IResponse | any> => {
    const { id, data } = payload;
    const result = JoiValidate(getRoleSchema, { id });
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }
    const updateSchemaResult = JoiValidate(roleSchema, { ...data });
    if (updateSchemaResult.error) {
      console.error(updateSchemaResult.error);
      return apiResponse({}, updateSchemaResult.error);
    }

    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getById(id);
      if (!existingRole) {
        return apiResponse(null, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
      }

      const result = await this.roleStore.updateRoleById(id, data);
      if (result.error) {
        return apiResponse(null, result.error);
      }
      return apiResponse(result.role, null);
    } catch (e) {
      console.error(e);
      return apiResponse(null, e);
    }
  };

  public deleteRole = async (
    payload: IRoleService.IDeleteRolePayload
  ): Promise<IResponse | any> => {
    const { id } = payload;
    const result = JoiValidate(getRoleSchema, { id });
    if (result.error) {
      console.error(result.error);
      return apiResponse({}, result.error);
    }

    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getById(id);
      if (!existingRole) {
        return apiResponse(null, toError(ErrorMessageEnum.ROLE_NOT_EXIST));
      }
      if (existingRole.error) {
        return apiResponse(null, existingRole.error);
      }
      const result: IRoleService.IRoleDbResponse =
        await this.roleStore.deleteRoleById(id);
      if (result.error) {
        return apiResponse(null, result.error);
      }
      return apiResponse(result.role, null);
    } catch (e) {
      return apiResponse(null, e);
    }
  };
}
