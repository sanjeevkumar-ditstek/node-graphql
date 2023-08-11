"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../db/users");
const handleDbError_1 = require("../../helper/handleDbError");
class UserStore {
    /**
     * creating new user and saving in Database
     */
    async createUser(userInput) {
        const savedUser = {};
        try {
            const { firstname, lastname, email, password, age, role } = userInput;
            savedUser.user = (await ((await users_1.UserModel.create({ firstname, lastname, email, password, age, role })).populate('role'))).toJSON();
            return savedUser;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            savedUser.error = Error;
            return savedUser;
        }
    }
    /**
     *Get by email
     */
    async getByEmail(email) {
        const resultUser = {};
        try {
            resultUser.user = await users_1.UserModel.findOne({ email });
            return resultUser;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            resultUser.error = Error;
            return resultUser;
        }
    }
    /**
     *Get by id
     */
    async getById(id) {
        const resultUser = {};
        try {
            resultUser.user = await users_1.UserModel.findOne({ _id: id });
            return resultUser;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            resultUser.error = Error;
            return resultUser;
        }
    }
    /**
     *
     * getAll users
     */
    async getAll() {
        const result = {};
        try {
            result.users = await users_1.UserModel.find({});
            return result;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            result.error = Error;
            return result;
        }
    }
    /**
     * Update user by id
     */
    async updateUserById(id, payload) {
        const result = {};
        try {
            const { id, data } = payload;
            await users_1.UserModel.findOneAndUpdate({ _id: id }, ...data);
            result.user = { id, ...payload };
            return result;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            result.error = Error;
            return result;
        }
    }
    /**
     * Delete User By Id
     */
    async deleteUserById(id) {
        const result = {};
        try {
            await users_1.UserModel.findOneAndDelete({ _id: id });
            result.user = { _id: id };
            return result;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            result.error = Error;
            return result;
        }
    }
}
exports.default = UserStore;
UserStore.OPERATION_UNSUCCESSFUL = class extends Error {
    constructor(message = "An error occured while processing the request.", code) {
        super(message);
        this.code = code;
    }
};
