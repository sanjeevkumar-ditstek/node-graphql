import { dbError } from "../utils/interface/common";

export const handleDbError = (error: any): dbError => {
  const resultError: dbError = {
    message: "null",
    code: "null",
  };

  switch (error.name) {
    case "CommandNotFound":
      resultError.message = "The requested command is not supported by the server.";
      resultError.code = "2";
      break;
    case "CommandNotSupported":

      resultError.message = "The requested command is not supported by the server.";
      resultError.code = "3";
      break;
    case "FailedToParse":
      resultError.message = "The server failed to parse the request.";
      resultError.code = "9";
      break;

    case "Unauthorized":
      resultError.message = "The user is not authorized to perform the operation.";
      resultError.code = "13";
      break;

    case "Conflict":
      resultError.message = "An update operation attempted to modify a field that cannot be modified concurrently.";
      resultError.code = "18";
      break;

    case "TypeMismatch":
      resultError.message = "The type of data passed to a command or field does not match the expected type.";
      resultError.code = "14";
      break;

    case "IllegalOperation":
      resultError.message = "The operation is not allowed in the current context.";
      resultError.code = "20";
      break;

    case "ExceededTimeLimit":
      resultError.message = "The operation exceeded the time limit set on the server.";
      resultError.code = "50";
      break;

    case "DuplicateKey":
      resultError.message = "A unique index constraint violation, indicating a duplicate key insertion attempt.";
      resultError.code = "11000";
      break;

    case "CannotCreateIndex":

      resultError.message = "An error occurred during index creation.";
      resultError.code = "13334";
      break;

    default:
      resultError.message = "Unknown Error Occur!";
      resultError.code = "unknown";
  }

  return resultError;
};
