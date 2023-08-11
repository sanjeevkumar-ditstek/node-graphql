import jwt from "jsonwebtoken";
import { AuthResponse } from "../interface/common";
// import dotenv from 'dotenv';
// import { GraphQLError } from "graphql";
// dotenv.config();

export const extractBearerToken = (req: any): string | undefined => {
  try {
    const token = req.headers.authorization;
    return token;
  } catch (e) {
    console.log(e);
  }
};

export default function authenticate(token: string): AuthResponse {
  const response: AuthResponse = {
    data: undefined,
    error: undefined,
  };
  try {
    const data: any = jwt.verify(token, "process.env.JWT_SECRET");
    if (data) {
      response.data = data;
    } else {
      response.error = "something is wrong jwt not returned any data.";
    }
    return response;
  } catch (e) {
    response.error = JSON.stringify(e);
    return response;
  }
}
