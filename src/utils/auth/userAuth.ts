import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { GraphQLError } from "graphql";
dotenv.config();

export const extractBearerToken = (req: any): string | undefined => {
    let next: any = {};
    next.token = req.headers.authorization;
    return next;
};

export default function authenticate(token: string): any {
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
        if (error) {
            console.error(error);
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: { status: 401 },
                },
              });
            return error
        } else if (data) {
            let user = data;
            return user
        }
    });
}
