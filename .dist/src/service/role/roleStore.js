"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../db/roles");
const handleDbError_1 = require("../../helper/handleDbError");
class RoleStore {
    /**
     * creating new role and saving in Database
     */
    async createRole(roleInput) {
        const savedRole = {};
        try {
            const { name } = roleInput;
            savedRole.role = await roles_1.RoleModel.create({ name });
            return savedRole;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            savedRole.error = Error;
            return savedRole;
        }
    }
    /**
     *Get by email
     */
    async getByName(name) {
        const resultRole = {};
        try {
            resultRole.role = await roles_1.RoleModel.findOne({ name });
            return resultRole;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            resultRole.error = Error;
            return resultRole;
        }
    }
    /**
     *Get by id
     */
    async getById(id) {
        const resultRole = {};
        try {
            resultRole.role = await roles_1.RoleModel.findOne({ _id: id });
            return resultRole;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            resultRole.error = Error;
            return resultRole;
        }
    }
    async getAll() {
        const resultRole = {};
        try {
            resultRole.roles = await roles_1.RoleModel.find({});
            return resultRole;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            resultRole.error = Error;
            return resultRole;
        }
    }
    async updateRoleById(id, payload) {
        const result = {};
        try {
            await roles_1.RoleModel.findOneAndUpdate({ _id: id }, payload);
            result.role = { _id: id, ...payload };
            return result;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            result.error = Error;
            return result;
        }
    }
    async deleteRoleById(id) {
        const result = {};
        try {
            await roles_1.RoleModel.findOneAndDelete({ _id: id });
            return result;
        }
        catch (error) {
            const Error = (0, handleDbError_1.handleDbError)(error);
            result.error = Error;
            return result;
        }
    }
}
exports.default = RoleStore;
RoleStore.OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
        super("An error occured while processing the request.");
    }
};
