import { Role as IROLE } from "../../utils/interface/IRole";
import { RoleModel } from "../../db/roles";

export default class RoleStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};
	/**
	 * creating new role and saving in Database
	 */
	public async createRole(userInput: IROLE): Promise<IROLE> {
		try {
			const { role } = userInput;
			let savedUser: IROLE = await RoleModel.create({ role });
			return savedUser;
		} catch (error) {
			return error;
		}
	}
	/**
	 *Get by email
	 */
	public async getByName(role: string): Promise<IROLE> {
		try {
			let result: any = await RoleModel.findOne({ role: role });
			return result;
		} catch (e) {
			return Promise.reject(new RoleStore.OPERATION_UNSUCCESSFUL());
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IROLE> {
		try {
			let result: IROLE = await RoleModel.findOne({ _id: id });
			return result;
		} catch (e) {
			return Promise.reject(new RoleStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async getAll(): Promise<IROLE[]> {
		try {
			let users: IROLE[] = await RoleModel.find();
			return users;
		} catch (e) {
			return Promise.reject(new RoleStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async updateRoleById(id: string, payload: any): Promise<IROLE> {
		try {
			await RoleModel.findOneAndUpdate({ _id: id }, payload);
			return await RoleModel.findOne({ _id: id });

		} catch (e) {
			return Promise.reject(new RoleStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async deleteRoleById(id: string): Promise<IROLE> {
		try {
			return await RoleModel.findOneAndDelete({ _id: id });
		} catch (e) {
			return Promise.reject(new RoleStore.OPERATION_UNSUCCESSFUL());
		}
	}

}