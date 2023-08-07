enum ErrorMessageEnum {
	INVALID_REQUEST = "Invalid Request Created",
	RECORD_NOT_FOUND = "Record Not Found",
	INVALID_USER_ID = "Invalid User Id",
	INVALID_EMAIL_OR_CODE = "Invalid Email or Code!!",
	EMAIL_ALREADY_EXIST = "Email Already Exist",
	ROLE_ALREADY_EXIST = "Role Already Exist",
	ROLE_NOT_EXIST = "Role Not Exists!",
	INTERNAL_ERROR = "Internal server Error",
	REQUEST_PARAMS_ERROR = "Something Wrong In Req Params!",
	USER_NOT_EXIST = "User not exists!",
	INVALID_CREDENTIALS = "Invalid Credentials!",
	GRAPH_QL_ERROR = "This operation has been blocked as a potential Cross-Site Request Forgery (CSRF). Please either specify a 'content-type' header (with a type that is not one of application/x-www-form-urlencoded, multipart/form-data, text/plain) or provide a non-empty value for one of the following headers: x-apollo-operation-name, apollo-require-preflight"
}

export default ErrorMessageEnum;
