const joi = require('joi')

const registerUserSchema = joi.object({
    fullname: joi.string().max(50).required(),
    username: joi.string().max(30).required(),
    address: joi.string().max(255).required(),
    phone: joi.string().max(15).required(),
    email: joi.string().max(255).email().required(),
    password: joi.string().min(8).max(50).required(),
    confirmPassword: joi.valid(joi.ref('password')).label('confirm password').required().messages({ "any.only" : "Password must match" })
})

module.exports = { registerUserSchema }