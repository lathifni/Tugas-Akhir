const { registerUserController, allAdminController, allCostumerController, updateUserInformationController, newAdminController } = require('../controllers/usersController')
const { detailById, deleteAdmin } = require('../services/users')
const { registerUserSchema } = require('../validations/userValidator')

const registerHandlerLama = async (req, res) => {
    const cekBody = registerUserSchema.validate(req.body)
    if (cekBody.error) return res.status(400).send({ error: cekBody.error.details[0].message })

    const register = await registerUserController(req.body)
    if (register == 'username not availabe') return res.status(401).send({status: 'failed', msg: 'username not available, please try another username'})
    if (register == 'email not available') return res.status(401).send({status: 'failed', msg: 'email not available, please try another email'})
    return res.status(201).send({status: 'success',msg: 'registrasi berhasil'})
}

const registerHandler = async (req, res) => {
    const cekBody = registerUserSchema.validate(req.body)
    if (cekBody.error) return res.status(400).send({ error: cekBody.error.details[0].message })

    const register = await registerUserController(req.body)
    console.log(register);
    if (register == 1) {
        return res.status(201).send({status: 'success',msg: 'registrasi berhasil'})
    }
    return res.status(400).send({ error: 'Cannot register user' })
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

const detailByIdHandler = async(req, res) => {
    try {        
        const list = await detailById(req.params)

        return res.status(200).send({status: 'success', data: list})
    } catch (error) {
        console.log(error);
    }
}

const updateUserInformationHandler = async(req, res) => {
    try {        
        const list = await updateUserInformationController(req.body)

        return res.status(204).send({status: 'success'})
    } catch (error) {
        console.log(error);
        return res.status(201).send({status: 'success'})
    }
}

const newAdminHandler = async(req, res) => {
    try {        
        const data = await newAdminController(req.body)
        if (data == 0) return res.status(200).send({status: 'Username or email is not available'})
        return res.status(201).send({status: 'success'})
    } catch (error) {
        console.log(error);
        return res.status(201).send({status: 'success'})
    }
}

const deleteAdminHandler = async(req, res) => {
    try {        
        await deleteAdmin(req.params)
        return res.status(200).send({status: 'success'})
    } catch (error) {
        console.log(error);
        // return res.status(200).send({status: 'success'})
    }
}

module.exports = { 
    registerHandler, allAdminHandler, allCostumerHandler, detailByIdHandler
    , updateUserInformationHandler, newAdminHandler, deleteAdminHandler
}
