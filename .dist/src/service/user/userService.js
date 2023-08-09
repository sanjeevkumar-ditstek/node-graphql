"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userStore_1 = __importDefault(require("./userStore"));
const errorMessage_1 = __importDefault(require("../../utils/enum/errorMessage"));
const common_1 = require("../../utils/interface/common");
const apiResonse_1 = require("../../helper/apiResonse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import dotenv from 'dotenv';
const JoiValidate_1 = require("../../helper/JoiValidate");
const schema_1 = require("../../utils/joiSchema/schema");
const joiErrorHandler_1 = require("../../helper/joiErrorHandler");
const apollo_server_express_1 = require("apollo-server-express");
// dotenv.config();
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
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.userCreateSchema, payload);
            if (error) {
                console.error(error);
                const joiErr = (0, joiErrorHandler_1.JoiError)(error);
                return new apollo_server_express_1.ApolloError(JSON.stringify(joiErr), "unknown");
            }
            const { firstname, lastname, email, password, age, role } = value;
            // Check if email is already registered...
            let existingUser;
            try {
                existingUser = await this.userStore.getByEmail(email);
                //Error if email id is already exist
                if (existingUser && existingUser?.user?.email) {
                    const Error = {
                        message: errorMessage_1.default.EMAIL_ALREADY_EXIST,
                    };
                    return (0, apiResonse_1.apiResponse)(null, Error);
                }
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(null, e);
            }
            const roleResponse = await this.proxy.role.getByName({ name: role });
            if (roleResponse.error) {
                return roleResponse;
            }
            let result;
            try {
                const hashPassword = await bcrypt_1.default.hash(password, 10);
                const attributes = {
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
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.user, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.updateUser = async (payload) => {
            const { id, data } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getUserSchema, { id });
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.userUpdateSchema, { ...data });
            if (error) {
                console.error(error);
                return (0, apiResonse_1.apiResponse)(null, error);
            }
            if (data.role) {
                const roleResponse = await this.proxy.role.getByName({ name: data.role });
                if (roleResponse.error) {
                    return roleResponse;
                }
            }
            let existingUser;
            try {
                existingUser = await this.userStore.getById(id);
                if (existingUser.error) {
                    return (0, apiResonse_1.apiResponse)(null, existingUser.error);
                }
                if (!existingUser.user) {
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
                const result = await this.userStore.updateUserById(payload.id, payload.data);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.user, null);
            }
            catch (e) {
                console.error(e);
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.deleteUser = async (payload) => {
            const { id } = payload;
            const result = (0, JoiValidate_1.JoiValidate)(schema_1.getUserSchema, payload);
            if (result.error) {
                console.error(result.error);
                return (0, apiResonse_1.apiResponse)({}, result.error);
            }
            let existingUser;
            try {
                existingUser = await this.userStore.getById(id);
                if (existingUser.error) {
                    return (0, apiResonse_1.apiResponse)(null, existingUser.error);
                }
                if (!existingUser.user) {
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
                const result = await this.userStore.deleteUserById(id);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.user, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.getUsers = async () => {
            let result;
            try {
                result = await this.userStore.getAll();
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                return (0, apiResonse_1.apiResponse)(result.users, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.getUser = async (payload) => {
            let result;
            try {
                const resultId = (0, JoiValidate_1.JoiValidate)(schema_1.getUserSchema, payload);
                if (resultId.error) {
                    console.error(resultId.error);
                    return (0, apiResonse_1.apiResponse)([], resultId.error);
                }
                result = await this.userStore.getById(payload.id);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                if (!result.user) {
                    const error = new Error();
                    error.message = errorMessage_1.default.USER_NOT_EXIST;
                    return (0, apiResonse_1.apiResponse)(null, error);
                }
                return (0, apiResonse_1.apiResponse)(result.user, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        // loginUser
        this.loginUser = async (payload) => {
            const { email, password } = payload;
            const { error, value } = (0, JoiValidate_1.JoiValidate)(schema_1.loginSchema, { email, password });
            if (error) {
                console.error(error);
                return (0, apiResonse_1.apiResponse)(null, error);
            }
            let result;
            try {
                result = await this.userStore.getByEmail(email);
                if (result.error) {
                    return (0, apiResonse_1.apiResponse)(null, result.error);
                }
                if (!result) {
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMessage_1.default.USER_NOT_EXIST));
                }
                const isValid = await bcrypt_1.default.compare(password, result?.user ? result?.user?.password : "");
                if (!isValid || !result.user?.password) {
                    const errorMsg = errorMessage_1.default.INVALID_CREDENTIALS;
                    return (0, apiResonse_1.apiResponse)(null, (0, common_1.toError)(errorMsg));
                }
                const token = this.generateJWT(result.user);
                return (0, apiResonse_1.apiResponse)({ token, id: result.user.id }, null);
            }
            catch (e) {
                return (0, apiResonse_1.apiResponse)(null, e);
            }
        };
        this.proxy = proxy;
    }
}
exports.default = UserService;
