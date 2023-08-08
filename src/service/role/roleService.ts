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
import dotenv from "dotenv";
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
      data: null,
    };
    const { error, value } = JoiValidate(roleSchema, payload);
    if (error) {
      console.error(error);
      const joiErr = JoiError(error);
      return new ApolloError(JSON.stringify(joiErr), "unknown");
    }
    const { name } = payload;
    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getByName(name);
      if (existingRole.error) {
        return apiResponse(
          null,
          existingRole.error
        );
      }
      if (existingRole && existingRole?.role?.name === name) {
        const Error: dbError = { message: ErrorMessageEnum.ROLE_ALREADY_EXIST };
        return apiResponse(
          null,
          Error
        );
      }
    } catch (e) {
      console.error(e);
      return apiResponse(
        {},
        e
      );
    }
    let resultRole: IRoleService.IRoleDbResponse;
    try {
      resultRole = await this.roleStore.createRole({ name });
      if (resultRole.error) {
        return apiResponse(
          {},
          resultRole.error
        );
      }
      return apiResponse(
        resultRole.role,
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

  public getRoles = async () => {
    const response: IRoleService.IGetAllRoleResponse = {
      data: null,
    };

    let rolesResult: IRoleService.IGetRoleListDbResponse;
    try {
      rolesResult = await this.roleStore.getAll();
      return apiResponse(
        rolesResult.roles,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  public getRole = async (payload: IRoleService.IGetRolePayload) => {
    const response: IRoleService.IGetRoleResponse = {
      data: null,
    };

    const result = JoiValidate(getRoleSchema, { id: payload.id });
    if (result.error) {
      console.error(result.error);
      return apiResponse(
        {},
        result.error
      );
    }

    let resultRole: IRoleService.IRoleDbResponse;
    try {
      resultRole = await this.roleStore.getById(payload.id);
      return apiResponse(
        resultRole.role,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };

  public getByName = async (payload: IRoleService.IgetRoleByNamePayload) => {
    const response: IRoleService.IgetRoleByNameResponse = {
      data: null,
    };
    const schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const params = schema.validate(payload);
    if (params.error) {
      console.error(params.error);
      return apiResponse(
        response,
        params.error
      );
    }
    const { role } = payload;
    // Check if email is already registered
    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getByName(role);
      //Error if email id is already exist
      if (!existingRole) {
        return apiResponse(
          [],
          toError(ErrorMessageEnum.ROLE_NOT_EXIST)
        );
      }
    } catch (e) {
      console.error(e);
      return apiResponse(
        response,
        e
      );
    }
    return apiResponse(
      existingRole,
      null
    );
  };

  public updateRole = async (payload: IRoleService.IUpdateRolePayload) => {
    const response: IRoleService.IUpdateRoleResponse = {
      data: null,
    };

    const result = JoiValidate(getRoleSchema, { id: payload.id });
    if (result.error) {
      console.error(result.error);
      return apiResponse(
        {},
        result.error
      );
    }
    const updateSchemaResult = JoiValidate(roleSchema, { id: payload.id });
    if (updateSchemaResult.error) {
      console.error(updateSchemaResult.error);
      return apiResponse(
        {},
        updateSchemaResult.error
      );
    }

    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getById(payload.id);
      if (!existingRole) {
        return apiResponse(
          null,
          toError(ErrorMessageEnum.ROLE_NOT_EXIST)
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
      const result = await this.roleStore.updateRoleById(
        payload.id,
        payload.data
      );
      return apiResponse(
        result.role,
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

  public deleteRole = async (payload: IRoleService.IDeleteRolePayload) => {
    const { id } = payload;
    const response: IRoleService.IDeleteRoleResponse = {
      data: null,
    };
    const result = JoiValidate(getRoleSchema, { id: payload.id });
    if (result.error) {
      console.error(result.error);
      return apiResponse(
        {},
        result.error
      );
    }

    let existingRole: IRoleService.IRoleDbResponse;
    try {
      existingRole = await this.roleStore.getById(id);
      if (!existingRole) {
        return apiResponse(
          null,
          toError(ErrorMessageEnum.ROLE_NOT_EXIST)
        );
      }
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
    try {
      const result: IRoleService.IRoleDbResponse =
        await this.roleStore.deleteRoleById(id);
      return apiResponse(
        result.role,
        null
      );
    } catch (e) {
      return apiResponse(
        null,
        e
      );
    }
  };
}
