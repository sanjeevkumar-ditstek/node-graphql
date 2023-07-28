import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
// import { GraphQLError } from "graphql";
dotenv.config();

export const extractBearerToken = (req: any): string | undefined => {
    try{
    const token= req.headers.authorization;
    return token;
    }
    catch(e){
        console.log(e , "EEEEEEE....")
    }
};

export default function authenticate(token: string): any {
    try{
        const data:any = jwt.verify(token, "process.env.JWT_SECRET");
        if (data) {
            const user = data;
            return user
        }
    }
    catch(e){
        console.log(e , "EEEEi authineticate")
    }
}
