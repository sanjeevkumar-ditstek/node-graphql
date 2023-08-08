"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
const apiResponse = (data, error) => {
    return {
        error,
        data,
    };
};
exports.apiResponse = apiResponse;
