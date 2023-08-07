"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const roleStore_1 = __importDefault(require("./roleStore"));
const statusCodes_1 = __importDefault(require("../../utils/enum/statusCodes"));
const errorMessage_1 = __importDefault(require("../../utils/enum/errorMessage"));
const responseMessage_1 = __importDefault(require("../../utils/enum/responseMessage"));
const common_1 = require("../../utils/interface/common");
const apiResonse_1 = require("../../helper/apiResonse");
const dotenv_1 = __importDefault(require("dotenv"));
const JoiValidate_1 = require("../../helper/JoiValidate");
const schema_1 = require("../../utils/joiSchema/schema");
const joiErrorHandler_1 = require("../../helper/joiErrorHandler");
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
class RoleService {
    constructor(proxy) {
        this.roleStore = new roleStore_1.default();
        this.create = async (payload) => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                status: false,
                data: null,
                message: ""
            };
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.roleSchema, payload);
            if (error) {
                console.error(error);
                const joiErr = (0, joiErrorHandler_1.JoiError)(error);
                return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), 'unknown');
            }
            const { name } = payload;
            let existingRole;
            try {
                existingRole = await this.roleStore.getByName(name);
                if (existingRole.error) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INVALID_CREDENTIALS, null, false, existingRole.error);
                }
                if (existingRole && existingRole?.role?.name === name) {
                    const Error = { message: errorMessage_1.default.ROLE_ALREADY_EXIST };
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.ROLE_ALREADY_EXIST, null, false, Error);
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, {}, false, e);
            }
            let resultRole;
            try {
                resultRole = await this.roleStore.createRole({ name });
                if (resultRole.error) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INVALID_CREDENTIALS, {}, true, resultRole.error);
                }
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_CREATED, resultRole.role, true, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.getRoles = async () => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                status: false,
                data: null,
                message: ""
            };
            let rolesResult;
            try {
                rolesResult = await this.roleStore.getAll();
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.ROLES_FETCHED, rolesResult.roles, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.getRole = async (payload) => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                status: false,
                data: null,
                message: ""
            };
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id: payload.id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, {}, false, result.error);
            }
            let resultRole;
            try {
                resultRole = await this.roleStore.getById(payload.id);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.ROLE_FETCHED, resultRole.role, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.getByName = async (payload) => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                status: false,
                data: null,
                message: ""
            };
            const schema = joi_1.default.object().keys({
                name: joi_1.default.string().required(),
            });
            const params = schema.validate(payload);
            if (params.error) {
                console.error(params.error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, response, false, params.error);
            }
            const { role } = payload;
            // Check if email is already registered
            let existingRole;
            try {
                existingRole = await this.roleStore.getByName(role);
                //Error if email id is already exist
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.ROLE_NOT_EXIST, [], false, (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, response, false, (e));
            }
            return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_CREATED, existingRole, true, null);
        };
        this.updateRole = async (payload) => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: "null",
                data: null,
                status: false
            };
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id: payload.id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, {}, false, result.error);
            }
            const updateSchemaResult = (0, JoiValidate_1.JoiValidate)(schema_1.roleSchema, { id: payload.id });
            if (updateSchemaResult.error) {
                console.error(updateSchemaResult.error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, {}, false, updateSchemaResult.error);
            }
            let existingRole;
            try {
                existingRole = await this.roleStore.getById(payload.id);
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.ROLE_NOT_EXIST, null, false, (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, (e));
            }
            try {
                const result = await this.roleStore.updateRoleById(payload.id, payload.data);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.ROLE_UPDATED, result.role, true, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.deleteRole = async (payload) => {
            const { id } = payload;
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: "",
                data: null,
                status: false
            };
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id: payload.id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, {}, false, result.error);
            }
            let existingRole;
            try {
                existingRole = await this.roleStore.getById(id);
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.ROLE_NOT_EXIST, null, false, (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, (e));
            }
            try {
                const result = await this.roleStore.deleteRoleById(id);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.ROLE_DELETED, result.role, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, (e));
            }
        };
        this.proxy = proxy;
    }
}
exports.default = RoleService;
