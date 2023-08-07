"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBearerToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv from 'dotenv';
// import { GraphQLError } from "graphql";
// dotenv.config();
const extractBearerToken = (req) => {
    try {
        const token = req.headers.authorization;
        return token;
    }
    catch (e) {
        console.log(e, "EEEEEEE....");
    }
};
exports.extractBearerToken = extractBearerToken;
function authenticate(token) {
    try {
        const data = jsonwebtoken_1.default.verify(token, "process.env.JWT_SECRET");
        if (data) {
            const user = data;
            return user;
        }
    }
    catch (e) {
        console.log(e, "EEEEi authineticate");
    }
}
exports.default = authenticate;
