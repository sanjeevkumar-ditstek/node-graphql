"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userStore_1 = __importDefault(require("./userStore"));
const statusCodes_1 = __importDefault(require("../../utils/enum/statusCodes"));
const errorMessage_1 = __importDefault(require("../../utils/enum/errorMessage"));
const responseMessage_1 = __importDefault(require("../../utils/enum/responseMessage"));
const common_1 = require("../../utils/interface/common");
const apiResonse_1 = require("../../helper/apiResonse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const JoiValidate_1 = require("../../helper/JoiValidate");
const schema_1 = require("../../utils/joiSchema/schema");
const joiErrorHandler_1 = require("../../helper/joiErrorHandler");
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
class UserService {
    constructor(proxy) {
        this.userStore = new userStore_1.default();
        this.generateJWT = (user) => {
            const payLoad = {
                id: user.id,
                email: user.email,
            };
            return jsonwebtoken_1.default.sign(payLoad, "process.env.JWT_SECRET");
        };
        this.create = async (payload) => {
            // try{
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                status: false,
                data: null,
                message: ""
            };
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.userCreateSchema, payload);
            if (error) {
                console.error(error);
                const joiErr = (0, joiErrorHandler_1.JoiError)(error);
                // return apiResponse(STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, false, joiErr);
                return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), 'unknown');
            }
            const { firstname, lastname, email, password, age } = value;
            // Check if email is already registered...
            let existingUser;
            try {
                existingUser = (await this.userStore.getByEmail(email));
                //Error if email id is already exist
                if (existingUser && existingUser?.user?.email) {
                    const Error = { message: errorMessage_1.default.EMAIL_ALREADY_EXIST };
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.EMAIL_ALREADY_EXIST, null, false, Error);
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, response, false, e);
            }
            // let rolePayload: IRoleService.IgetRoleByNamePayload = { role };
            // let roleResponse: IRoleService.IgetRoleByNameResponse = await this.proxy.role.getByName(rolePayload);
            // if (roleResponse.statusCode !== STATUS_CODES.OK) {
            // 	return roleResponse;
            // }
            let result;
            try {
                const hashPassword = await bcrypt_1.default.hash(password, 10);
                const attributes = {
                    firstname,
                    lastname,
                    email: email.toLowerCase(),
                    password: hashPassword,
                    age,
                    // role: roleRe_idsponse.data.
                };
                result = await this.userStore.createUser(attributes);
                if (result.error) {
                    console.log(result.error, "error");
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, result.error);
                }
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_CREATED, result.user, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.updateUser = async (payload) => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: responseMessage_1.default.INVALID_EMAIL_OR_CODE,
                data: null,
                status: false
            };
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.userCreateSchema, payload);
            if (error) {
                console.error(error);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.UNPROCESSABLE_ENTITY, errorMessage_1.default.REQUEST_PARAMS_ERROR, response, false, error);
            }
            let existingUser;
            try {
                existingUser = await this.userStore.getById(payload.id);
                if (!existingUser) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.USER_NOT_EXIST, null, false, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
            try {
                const result = await this.userStore.updateUserById(payload.id, payload.data);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_UPDATED, result.user, true, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.deleteUser = async (payload) => {
            const { id } = payload;
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: responseMessage_1.default.INVALID_EMAIL_OR_CODE,
                data: null,
                status: false
            };
            let existingUser;
            try {
                existingUser = await this.userStore.getById(id);
                if (!existingUser) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.USER_NOT_EXIST, null, false, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
            try {
                const result = await this.userStore.deleteUserById(id);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_DELETED, result.user, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.getUsers = async () => {
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: responseMessage_1.default.INVALID_EMAIL_OR_CODE,
                data: null,
                status: false
            };
            let result;
            try {
                result = await this.userStore.getAll();
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USERS_FETCHED, result.users, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.getUser = async (payload) => {
            let result;
            try {
                result = await this.userStore.getById(payload.id);
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_FETCHED, result.user, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        // loginUser
        this.loginUser = async (payload) => {
            const { email, password } = payload;
            const response = {
                statusCode: statusCodes_1.default.UNKNOWN_CODE,
                message: responseMessage_1.default.INVALID_EMAIL_OR_CODE,
                data: null,
                status: false
            };
            let result;
            try {
                result = await this.userStore.getByEmail(payload.email);
                if (!result) {
                    return (0, apiResonse_1.apiResponse)(statusCodes_1.default.BAD_REQUEST, errorMessage_1.default.USER_NOT_EXIST, null, false, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
                const isValid = await bcrypt_1.default.compare(password, result?.user ? result?.user?.password : "");
                if (!isValid || !result.user?.password) {
                    const errorMsg = errorMessage_1.default.INVALID_CREDENTIALS;
                    response.statusCode = statusCodes_1.default.UNAUTHORIZED;
                    response.error = (0, common_1.toError)(errorMsg);
                    return response;
                }
                response.statusCode = statusCodes_1.default.OK;
                response.token = this.generateJWT(result.user);
                response.user = result.user;
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.OK, responseMessage_1.default.USER_FETCHED, response, true, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(statusCodes_1.default.INTERNAL_SERVER_ERROR, errorMessage_1.default.INTERNAL_ERROR, null, false, e);
            }
        };
        this.proxy = proxy;
    }
}
exports.default = UserService;
