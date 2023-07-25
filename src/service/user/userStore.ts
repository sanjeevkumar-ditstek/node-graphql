import { User as IUSER } from "../../utils/interface/IUser";
import { UserModel } from "../../db/users";
import mongoose from 'mongoose';

export default class UserStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};

	/**
	 * creating new user and saving in Database
	 */
	public async createUser(userInput: IUSER): Promise<IUSER> {
		try {
			const { firstname, lastname, email, password, age, role } = userInput;
			let savedUser: any = (await (await UserModel.create({ firstname, lastname, email, password, age, roles: new mongoose.Types.ObjectId(role) })).populate('roles')).toJSON()

			console.log(savedUser, "SSSSSSSSS")
			return savedUser;
		} catch (error) {
			console.log(error, "errrr")
			return error;
		}
	}

	/**
	 *Get by email
	 */
	public async getByEmail(email: string): Promise<IUSER> {
		try {
			let user: any = await UserModel.findOne({ email });
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IUSER> {
		try {
			let user: any = await UserModel.findOne({ _id: id });
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async getAll(): Promise<IUSER[]> {
		try {
			let users: any = await UserModel.find();
			return users;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async updateUserById(id: string, payload: any): Promise<IUSER> {
		try {
			await UserModel.findOneAndUpdate({ _id: id }, payload);
			return await UserModel.findOne({ _id: id });

		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async deleteUserById(id: string): Promise<IUSER> {
		try {
			return await UserModel.findOneAndDelete({ _id: id });
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

}