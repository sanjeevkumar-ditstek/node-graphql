import * as IUserService from "../service/user/IUserService";

export const apiResponse = (statusCode: number, message: String, data: any, status: boolean, error: any) => {
    return {
        statusCode,
        message,
        data,
        status,
        error
    }
}