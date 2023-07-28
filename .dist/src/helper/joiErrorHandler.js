"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiError = void 0;
const JoiError = (error) => {
    const err = [];
    error.details.forEach((element) => {
        err.push({
            message: element.message,
            inputValue: element.context.value
        });
    });
    return err;
};
exports.JoiError = JoiError;
