import { AuthenticationError } from "apollo-server-express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAuthValidator = (context: any) => {
    const { currentUser } = context.req;
    if (!currentUser) {
        throw new AuthenticationError("Authentication is required");
    }
    if (
        currentUser.role !== "User" && currentUser.role !== "SuperAdmin" && currentUser.role !== "Admin"
    ) {
        throw new AuthenticationError("User and Admin and SuperAdmin can access only");
    }
};