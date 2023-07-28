"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appServiceProxy_1 = __importDefault(require("../service/appServiceProxy"));
const routes_1 = require("../helper/routes");
const userRoute = async (app) => {
    // app.get(userRoutes.UsersRoute , proxy.user.getUsers);
    app.post(routes_1.userRoutes.UsersRoute, appServiceProxy_1.default.user.create);
    // app.post("/user/login", proxy.user.login);
    // app.get(userRoutes.UserByIdRoute , proxy.user.getUserById);
};
exports.default = userRoute;
