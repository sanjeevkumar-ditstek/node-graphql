"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextValidation = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const errorMessage_1 = __importDefault(require("../utils/enum/errorMessage"));
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
const ContextValidation = (args, contextValue, isId = false, isData = false) => {
    const response = { success: false, error: null, args: null };
    try {
        if (!args.data &&
            (isData ? !args.data : true) &&
            (isId ? !args.id : true)) {
            if (!contextValue.args) {
                response.error = new apollo_server_express_1.ApolloError(errorMessage_1.default.GRAPH_QL__ARGS_ERROR, statusCodes_1.default.BAD_REQUEST.toString());
                return response;
            }
            if ((isData ? !contextValue.args.data : true) &&
                (isId ? !contextValue.args.id : true)) {
                response.error = new apollo_server_express_1.ApolloError(errorMessage_1.default.GRAPH_QL_CONTEXT_ARGS_ERROR, statusCodes_1.default.BAD_REQUEST.toString());
                return response;
            }
        }
        response.success = true;
        response.args = (args.data || (isData ? args.data : false) || (isId ? args.id : false)) ? args : contextValue.args;
        return response;
    }
    catch (e) {
        response.error = new apollo_server_express_1.ApolloError(JSON.stringify(e), statusCodes_1.default.BAD_REQUEST.toString());
        return response;
    }
};
exports.ContextValidation = ContextValidation;
