"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessageEnum;
(function (ErrorMessageEnum) {
    ErrorMessageEnum["INVALID_REQUEST"] = "Invalid Request Created";
    ErrorMessageEnum["RECORD_NOT_FOUND"] = "Record Not Found";
    ErrorMessageEnum["INVALID_USER_ID"] = "Invalid User Id";
    ErrorMessageEnum["INVALID_EMAIL_OR_CODE"] = "Invalid Email or Code!!";
    ErrorMessageEnum["EMAIL_ALREADY_EXIST"] = "Email Already Exist";
    ErrorMessageEnum["ROLE_ALREADY_EXIST"] = "Role Already Exist";
    ErrorMessageEnum["ROLE_NOT_EXIST"] = "Role Not Exists!";
    ErrorMessageEnum["INTERNAL_ERROR"] = "Internal server Error";
    ErrorMessageEnum["REQUEST_PARAMS_ERROR"] = "Something Wrong In Req Params!";
    ErrorMessageEnum["USER_NOT_EXIST"] = "User not exists!";
    ErrorMessageEnum["INVALID_CREDENTIALS"] = "Invalid Credentials!";
})(ErrorMessageEnum || (ErrorMessageEnum = {}));
exports.default = ErrorMessageEnum;
