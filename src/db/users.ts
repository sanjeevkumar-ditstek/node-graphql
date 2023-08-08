import mongoose, { Schema } from 'mongoose';
const  UserSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String , required: true },
    password: {type: String , required: true},
    age: {type: Number , require: true},
    // auth_token: {type: String , default: null},
    // isLoggedIn: {type: String, default: null},
    // isSignup: {type: String, default: null},
    role: { type: Schema.Types.ObjectId, ref: 'Role' , default: null}
})

export const UserModel = mongoose.model('User' , UserSchema)