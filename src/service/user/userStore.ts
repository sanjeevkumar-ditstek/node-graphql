import { User as IUSER } from "../../utils/interface/IUser";
import { UserModel } from "../../db/users";
import * as IUserService from "./IUserService";
import { handleDbError } from "../../helper/handleDbError";
import { dbError } from "../../utils/interface/common";
import { Console } from "winston/lib/winston/transports";
import mongoose from "mongoose";

export default class UserStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		public code: string;
		constructor(message =  "An error occured while processing the request.", code: string ) {
			super(message);
			this.code = code;
		}
	};
	/**
	 * creating new user and saving in Database
	 */
	public async createUser(userInput: IUSER): Promise<IUserService.IUserDbResponse> {
		const savedUser: IUserService.IUserDbResponse = {}
		try {
			const { firstname, lastname, email, password, age , role } = userInput;
			savedUser.user =   (await ((await UserModel.create({ firstname, lastname, email, password, age, role })).populate('role'))).toJSON()
			return savedUser;
		} catch (error:any) {
			const Error: dbError =	 handleDbError(error);
			savedUser.error = Error
			return savedUser
		}
	}

	/**
	 *Get by email
	 */
	public async getByEmail(email: string): Promise<IUserService.IUserDbResponse> {
		const resultUser: IUserService.IUserDbResponse = {}
		try {
			resultUser.user = await UserModel.findOne({  email })
			return resultUser;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			resultUser.error = Error
			return resultUser
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IUserService.IUserDbResponse> {
		const resultUser: IUserService.IUserDbResponse = {}
		try {
			resultUser.user = await UserModel.findOne({ _id: id })
			return resultUser;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			resultUser.error = Error
			return resultUser
		}
	}

	/**
	 * 
	 * getAll users
	 */
	public async getAll(): Promise<IUserService.IGetUserListDbResponse> {
		const result: IUserService.IGetUserListDbResponse = {}
		try {
			result.users = await UserModel.find({})
			return result;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			result.error = Error
			return result
		}
	}

	/**
	 * Update user by id
	 */
	public async updateUserById(id: string, payload: any): Promise<IUserService.IUserDbResponse> {
		const result: IUserService.IUserDbResponse = {}
		try {
			const { id, data} = payload;
			await UserModel.findOneAndUpdate({_id: id} , ...data)
			result.user = { id , ...payload}
			return result;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			result.error = Error
			return result
		}
	}
	
	/**
	 * Delete User By Id
	 */
	public async deleteUserById(id: string): Promise<IUserService.IUpdateUserDbResponse> {
		const result: IUserService.IUpdateUserDbResponse = {}
		try {
			await UserModel.findOneAndDelete({ _id: id });
			result.user = {id}
			return result;
		} catch (error:any) {
			const Error: dbError = handleDbError(error);
			result.error = Error
			return result
		}
	}
}
