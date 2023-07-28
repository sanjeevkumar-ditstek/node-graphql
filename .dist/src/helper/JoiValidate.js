"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiValidate = void 0;
const JoiValidate = (schema, values) => {
    const { value, error } = schema.validate(values);
    return { value, error };
};
exports.JoiValidate = JoiValidate;
