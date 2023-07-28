import Joi from "joi";

export const  userCreateSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    age: Joi.number().required(),
    // role: Joi.string().required(),
});

export const  userUploadSchema = Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    age: Joi.number(),
    // role: Joi.string().required(),
});

export const  getUserSchema = Joi.object().keys({
    id: Joi.string().required() 
});
