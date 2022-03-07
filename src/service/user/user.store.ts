import { Document, Schema, Model, model } from "mongoose";
import IUser from "./IUser";
import UserMongo from "../../model/userModel";

export interface IUserModel extends IUser, Document {
    _id: string;
}

export const UserSchema = new Schema(UserMongo, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

export const User: Model<IUserModel> = model<IUserModel>("users", UserSchema); 

export default class UserStore {
    public static OPERATION_UNSUCCESSFUL = class extends Error {
        constructor() {
            super("An error occured while processing the request.");
        }
    };

    /**
     * @param  {string} email
     * Desc: Find user by email id
     * @returns Promise
     */
    public async findByEmail(email: string): Promise<IUser> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let user: any;
        try {
            user = await User.findOne({
                email,
            });
        } catch (e) {
            return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
        }
        return user;
    }

    /**
     * @param  {any} attribute
     * @returns Promise
     */
    public async register(attribute:IUser): Promise<IUser> {
        let user: IUser;
        try {
            user = await User.create(attribute);
            console.log("user", user)
        } catch (e) {
            console.log("error", e)
            return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
        }
        return user;
    }
    /**
     * @param  {any} attribute
     * @returns Promise
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async get(attribute: any): Promise<IUser> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let user: any;
        try {
            user = await User.findOne(attribute);
        } catch (e) {
            return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
        }
        return user;
    }
}