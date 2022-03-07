import StatusCodeEnum from "../../utils/enum/StatusCodeEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import * as IUserService from "../../service/user/IUserService";
import { IAppServiceProxy } from "../AppServiceProxy";
import Joi from "joi";
import UserStore from "./user.store";
import IUser from "./IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import { logger } from "../logger/logger";
import { Role } from "../../utils/enum/role";

export default class UserService implements IUserService.IUserServiceAPI {
    private storage = new UserStore();
    public proxy: IAppServiceProxy;
    constructor(proxy: IAppServiceProxy) {
        this.proxy = proxy;
    }

    /*****Generate a Token*****/
    private generateJWT = (user: IUser): string => {
        const payLoad = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payLoad, JWT_SECRET);
    };

    /**
     * @param  {IUserService.IRegisterUserRequest} request
     * Desc: register a user
     * @returns Promise
     */
    public register = async (
        request: IUserService.IRegisterUserRequest
    ): Promise<IUserService.IRegisterUserResponse> => {
        let response: IUserService.IRegisterUserResponse = {
            status: StatusCodeEnum.UNKNOWN_CODE,
        };
        const schema = Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().optional(),
        });
        const params = schema.validate(request, { abortEarly: false });
        if (params.error) {
            console.error(params.error);
            response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
            response.error = params.error;
            
            return response;
        }

        const { firstName, lastName, email, password } =
            params.value;

            // console.log("here", params.value)
        const hashPassword = await bcrypt.hash(password, 10);

        let existingUser: IUser;
        if (email) {
            try {
                existingUser = await this.storage.findByEmail(email);
                if (existingUser) {
                    logger.error(ErrorMessageEnum.USER_EXIST);
                    response = {
                        status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
                        error: ErrorMessageEnum.USER_EXIST,
                    };
                   
                    return response;
                }
                const userAttributes = {
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    role: Role.User,
                };
                let user: IUser;

                // eslint-disable-next-line prefer-const
                user = await this.storage.register(userAttributes);
                response = {
                    status: StatusCodeEnum.OK,
                    user: user,
                }
                
                // console.log("response", response)
                return response;
            } catch (e) {
                logger.error(e);
                response ={
                    status: StatusCodeEnum.INTERNAL_SERVER_ERROR
                }
                return response;
            }
        }
        return response;
    };
    /**
     * @param  {IUserService.ILoginUserRequest} request
     * Desc: Login user using email and password
     * @returns Promise
     */
    public login = async (
        request: IUserService.ILoginUserRequest
    ): Promise<IUserService.ILoginUserResponse> => {
        let response: IUserService.ILoginUserResponse;

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const params = schema.validate(request);
        const { email, password } = params.value;

        if (params.error) {
            logger.error(params.error);
            logger.error(ErrorMessageEnum.RECORD_NOT_FOUND),
                (response = {
                    status: StatusCodeEnum.UNPROCESSABLE_ENTITY,
                    error: ErrorMessageEnum.RECORD_NOT_FOUND,
                });
            return response;
        }

        let user: IUser;
        // check if email exist or not
        try {
            user = await this.storage.findByEmail(email);
        } catch (e) {
            logger.error(ErrorMessageEnum.INVALID_REQUEST),
                (response = {
                    status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
                    error: ErrorMessageEnum.INVALID_REQUEST,
                });
            return response;
        }
        if (!user || !user.email) {
            logger.error(ErrorMessageEnum.INVALID_REQUEST),
                (response = {
                    status: StatusCodeEnum.NOT_FOUND,
                    error: ErrorMessageEnum.INVALID_REQUEST,
                });
            return response;
        }

        let isValid: boolean;
        const hashPassword = user.password;
        // eslint-disable-next-line prefer-const
        isValid = await bcrypt.compare(password, hashPassword);
        if (!isValid || !user.password) {
            logger.error(ErrorMessageEnum.INVALID_EMAIL_OR_CODE),
                (response = {
                    status: StatusCodeEnum.NOT_FOUND,
                    error: ErrorMessageEnum.INVALID_EMAIL_OR_CODE,
                });
            return response;
        }
        response = {
            status: StatusCodeEnum.OK,
            token: this.generateJWT(user),
            user: user,
            message: "Login Successful",
        };

        return response;
    };

    /**
     * @param  {IUserService.IGetUserRequest} request
     * Desc: get user
     * @returns Promise
     */
    public get = async (
        request: IUserService.IGetUserRequest
    ): Promise<IUserService.IGetUserResponse> => {
        const response: IUserService.IGetUserResponse = {
            status: StatusCodeEnum.UNKNOWN_CODE,
        };
        let user: IUser;

        try {
            user = await this.storage.get(request);
            if (!user) {
                logger.error(ErrorMessageEnum.RECORD_NOT_FOUND),
                    (response.status = StatusCodeEnum.NOT_FOUND);
                response.error = ErrorMessageEnum.RECORD_NOT_FOUND;
                return response;
            }
        } catch (e) {
            logger.error(e), (response.status = StatusCodeEnum.NOT_FOUND);
            response.error = e;
            return response;
        }
        response.status = StatusCodeEnum.OK;
        response.user = user;
        return response;
    };
}