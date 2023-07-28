export interface User {
	id?: string;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	age: number;
	// role: string;
}

export interface UpdateUser {
	id?: string;
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	age?: number;
	// role?: string;
}
