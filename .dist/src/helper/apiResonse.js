"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
const apiResponse = (statusCode, message, data, status, error) => {
    return {
        status,
        error,
        statusCode,
        message,
        data
    };
};
exports.apiResponse = apiResponse;
