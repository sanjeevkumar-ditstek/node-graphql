import { Role as IROLE } from "../../utils/interface/IRole";
import { RoleModel } from "../../db/roles";
import * as IRoleService from "./IRoleService";
import { handleDbError } from "../../helper/handleDbError";
import { dbError } from "../../utils/interface/common";

export default class RoleStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};
	/**
	 * creating new role and saving in Database
	 */
	public async createRole(roleInput: IROLE): Promise<IRoleService.IRoleDbResponse> {
		const savedRole: IRoleService.IRoleDbResponse = {}
		try {
			const { name } = roleInput;
			savedRole.role   =   await RoleModel.create({ name })
			return savedRole;
		} catch (error:any) {
			const Error: dbError =	 handleDbError(error);
			savedRole.error = Error
			return savedRole
		}
	} 
	/**
	 *Get by email
	 */
	public async getByName(name: string): Promise<IRoleService.IRoleDbResponse> {
        const resultRole: IRoleService.IRoleDbResponse = {}
		try {
			resultRole.role = await RoleModel.findOne({ name })
			return resultRole;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			resultRole.error = Error
			return resultRole
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IRoleService.IRoleDbResponse> {
		const resultRole: IRoleService.IRoleDbResponse = {}
		try {
			resultRole.role = await RoleModel.findOne({ _id: id })
			return resultRole;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			resultRole.error = Error
			return resultRole
		}
	}

	public async getAll(): Promise<IRoleService.IGetRoleListDbResponse> {
		const resultRole: IRoleService.IGetRoleListDbResponse = {}
		try {
			resultRole.roles = await RoleModel.find({})
			return resultRole;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			resultRole.error = Error
			return resultRole
		}
	}

	public async updateRoleById(id: string, payload: any): Promise<IRoleService.IRoleDbResponse> {
		const result: IRoleService.IRoleDbResponse = {}
		try {
			await RoleModel.findOneAndUpdate({_id: id} , payload)
			result.role = { _id: id , ...payload}
			return result;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			result.error = Error
			return result
		}
	}

	public async deleteRoleById(id: string): Promise<IRoleService.IRoleDbResponse> {
        const result: IRoleService.IRoleDbResponse = {}
		try {
			await RoleModel.findOneAndDelete({_id: id})
			return result;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			result.error = Error
			return result
		}
	}
}
