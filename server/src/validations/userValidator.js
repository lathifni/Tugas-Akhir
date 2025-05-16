const joi = require('joi')

const registerUserSchema = joi.object({
    fullname: joi.string().max(50).required(),
    address: joi.string().max(255).required(),
    phone: joi.string().max(15).required(),
    email: joi.string().max(255).email().required(),
})

module.exports = { registerUserSchema }