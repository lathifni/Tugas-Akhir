const joi = require('joi')

const loginUserSchema = joi.object({
    emailOrUsername: joi.string().max(255).required(),
    password: joi.string().min(8).max(255).required(),
})

module.exports = { loginUserSchema }