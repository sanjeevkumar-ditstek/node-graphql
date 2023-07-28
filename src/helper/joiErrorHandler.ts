import { IError } from "../utils/interface/common"
export const JoiError = (error: any): any => {
    const err: any  = [];
    error.details.forEach((element: any) => {
        err.push({
            message: element.message,
            inputValue: element.context.value
        })
    });
    return err;
}
