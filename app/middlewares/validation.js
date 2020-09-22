const Joi = require('@hapi/joi');

//Login Validation
const loginValidation = (data) =>{
    const schema = Joi.object({
        // username: Joi.string().min(8).required().email(),
        username: Joi.string().min(8).required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(data);
}

//External Login Validation
const externalLoginValidation = (data) =>{
    const schema = Joi.object({
        email: Joi.string().min(8).required().email(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(data);
}

//Register Validation
const registerValidation = (data) =>{
    const schema = Joi.object({
        nip: Joi.string().min(3).required(),
        npsn: Joi.string().min(3).required(),
        nama: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(10).required()
    });

    return schema.validate(data);
}


//Notification Validation
const notificationValidation = (data) =>{
    const schema = Joi.object({
        school: Joi.string().min(3).required(),
        title: Joi.string().min(3).required(),
        date: Joi.string().min(3).required(),
        content: Joi.string().min(3).required()
    });

    return schema.validate(data);
}

module.exports.loginValidation = loginValidation;
module.exports.externalLoginValidation = externalLoginValidation;
module.exports.registerValidation = registerValidation;
module.exports.notificationValidation = notificationValidation;

