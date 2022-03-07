import * as IUserService from "../../service/user/IUserService";
import proxy from "../../service/AppServiceProxy";
import { Response } from "../../utils/enum/ResponseCheck";
import StatusCodeEnum from "../../utils/enum/StatusCodeEnum";
import { useAuthValidator } from "../../middlleware/authValidator";
export const resolver = {
    Query: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        async login(parent: any, args: any, context: any) {
            const { email, password } = args;

            const request: IUserService.ILoginUserRequest = {
                email,
                password,
            };

            let response: IUserService.ILoginUserResponse = {
                status: StatusCodeEnum.UNKNOWN_CODE,
            };

            try {
                response = await proxy.user.login(request);
                Response.checkStatus(response);
            } catch (e) {
                Response.catchThrow(e);
            }

            return response;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async getUsers(parent: any, args: any, context: any) {
            useAuthValidator(context);
            const returnUser = context.req.currentUser;

            const request: IUserService.IGetUserRequest = returnUser;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let response: any;
            try {
                response = await proxy.user.get(request);
                Response.checkStatus(response);
            } catch (e) {
                Response.catchThrow(e);
            }
            return response;
        },
    },
    Mutation: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        async register(parent: any, args: any, context: any) {
            const { firstName, lastName, email, password, role } =
                args.params;

            const request: IUserService.IRegisterUserRequest = {
                firstName,
                lastName,
                email,
                password,
                role
            };
            let response: IUserService.IRegisterUserResponse = {
                status: StatusCodeEnum.UNKNOWN_CODE,
            };

            try {
                response = await proxy.user.register(request);
                Response.checkStatus(response);
            } catch (e) {
                Response.catchThrow(e);
            }

            return response?.user;
        }
    }
}