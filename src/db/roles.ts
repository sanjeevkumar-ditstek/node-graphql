import mongoose, { Schema } from 'mongoose';
const  RoleSchema = new Schema({
    role: {
        type: String,
        enum : ['ADMIN','USER','GUEST','VIEWER'],
        required: true,
        default: "GUEST"
    }
})

export const RoleModel = mongoose.model('Role' , RoleSchema);