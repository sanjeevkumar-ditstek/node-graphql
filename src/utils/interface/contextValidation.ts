import { ApolloError } from "apollo-server-express";
export interface CtxValidation {
	error: ApolloError| null, 
    success: boolean,
    args: any
}