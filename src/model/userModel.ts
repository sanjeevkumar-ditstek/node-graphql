import { Role } from "../utils/enum/role";

import { nanoid } from 'nanoid'

export default {
     _id: {
        type: String,
        required:false,
        default: () => nanoid(),
        // index: { unique: true },
     },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: [Role.Admin, Role.SuperAdmin, Role.User],
    }
};