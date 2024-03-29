const { registerUserController, allAdminController, allCostumerController } = require('../controllers/usersController')
const { registerUserSchema } = require('../validations/userValidator')

const registerHandler = async (req, res) => {
    const cekBody = registerUserSchema.validate(req.body)
    if (cekBody.error) return res.status(400).send({ error: cekBody.error.details[0].message })

    const register = await registerUserController(req.body)
    if (register == 'username not availabe') return res.status(401).send({status: 'failed', msg: 'username not available, please try another username'})
    if (register == 'email not available') return res.status(401).send({status: 'failed', msg: 'email not available, please try another email'})
    return res.status(201).send({status: 'success',msg: 'registrasi berhasil'})
}

const allAdminHandler = async(req, res) => {
    try {
        const list = await allAdminController()

        return res.status(200).send({status: 'success', data: list})
    } catch (error) {
        console.log(error);
    }
}

const allCostumerHandler = async(req, res) => {
    try {
        const list = await allCostumerController()

        return res.status(200).send({status: 'success', data: list})
    } catch (error) {
        console.log(error);
    }
}

module.exports = { registerHandler, allAdminHandler, allCostumerHandler, }
