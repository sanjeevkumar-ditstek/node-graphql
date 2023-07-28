"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toError = exports.joiToError = void 0;
function joiToError(joiError) {
    let message = "There was an error processing your request. Please contact support.";
    if (joiError && joiError.details && joiError.details[0]) {
        message = joiError.details[0].message;
    }
    else {
        message = joiError.message;
    }
    const error = {
        message,
    };
    return error;
}
exports.joiToError = joiToError;
function toError(message) {
    const error = {
        message,
    };
    return error;
}
exports.toError = toError;
