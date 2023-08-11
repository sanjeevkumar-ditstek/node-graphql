"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roleStore_1 = __importDefault(require("./roleStore"));
const errorMessage_1 = __importDefault(require("../../utils/enum/errorMessage"));
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
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.roleSchema, payload.data);
            if (error) {
                console.error(error);
                const joiErr = (0, joiErrorHandler_1.JoiError)(error);
                return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), errorMessage_1.default.UNKNOWN);
            }
            const { name } = payload.data;
            let existingRole;
            try {
                existingRole = await this.roleStore.getByName(name);
                if (existingRole.error) {
                    return (0, apiResonse_1.apiResponse)(null, existingRole.error);
                }
                if (existingRole && existingRole?.role?.name) {
                    const Error = { message: errorMessage_1.default.ROLE_ALREADY_EXIST };
                    return (0, apiResonse_1.apiResponse)(null, Error);
                }
                const resultRole = await this.roleStore.createRole(value);
                if (resultRole.error) {
                    return (0, apiResonse_1.apiResponse)({}, resultRole.error);
                }
                return (0, apiResonse_1.apiResponse)(resultRole.role, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)({}, e);
            }
        };
        this.getRoles = async () => {
            let rolesResult;
            try {
                rolesResult = await this.roleStore.getAll();
                if (rolesResult.error) {
                    return (0, apiResonse_1.apiResponse)(null, rolesResult.error);
                }
                return (0, apiResonse_1.apiResponse)(rolesResult.roles, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.getRole = async (payload) => {
            const { id } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            let resultRole;
            try {
                resultRole = await this.roleStore.getById(id);
                if (resultRole.error) {
                    return (0, apiResonse_1.apiResponse)(null, resultRole.error);
                }
                if (!resultRole.role) {
                    const error = new Error();
                    error.message = errorMessage_1.default.ROLE_NOT_EXIST;
                    return (0, apiResonse_1.apiResponse)(null, error);
                }
                return (0, apiResonse_1.apiResponse)(resultRole.role, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.getByName = async (payload) => {
            const { name } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleByNameSchema, { name });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            // Check if email is already registered
            let existingRole;
            try {
                existingRole = await this.roleStore.getByName(name);
                //Error if email id is already exist
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)([], (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
                if (existingRole.error) {
                    return (0, apiResonse_1.apiResponse)(null, existingRole.error);
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(null, e);
            }
            return (0, apiResonse_1.apiResponse)(existingRole.role, null);
        };
        this.updateRole = async (payload) => {
            const { id, data } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            const updateSchemaResult = (0, JoiValidate_1.JoiValidate)(schema_1.roleSchema, { ...data });
            if (updateSchemaResult.error) {
                console.error(updateSchemaResult.error);
                return (0, apiResonse_1.apiResponse)({}, updateSchemaResult.error);
            }
            let existingRole;
            try {
                existingRole = await this.roleStore.getById(id);
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
                const result = await this.roleStore.updateRoleById(id, data);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.role, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.deleteRole = async (payload) => {
            const { id } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getRoleSchema, { id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            let existingRole;
            try {
                existingRole = await this.roleStore.getById(id);
                if (!existingRole) {
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMessage_1.default.ROLE_NOT_EXIST));
                }
                if (existingRole.error) {
                    return (0, apiResonse_1.apiResponse)(null, existingRole.error);
                }
                const result = await this.roleStore.deleteRoleById(id);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.role, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.proxy = proxy;
    }
}
exports.default = RoleService;
