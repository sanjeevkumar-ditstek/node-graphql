"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter_1 = __importDefault(require("../routes/userRouter"));
const routes = async (app) => {
    (0, userRouter_1.default)(app);
};
exports.default = routes;
