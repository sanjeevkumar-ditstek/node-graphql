import mongoose, { Schema } from 'mongoose';
const  RoleSchema = new Schema({
    name: {
        type: String,
        // enum : ['ADMIN','USER','GUEST','SUPERADMIN'],
        required: true,
        default: "GUEST"
    }
})

export const RoleModel = mongoose.model('Role' , RoleSchema);
