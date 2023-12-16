const getDataController = require('../controllers/getDataController')
const { registerUserController } = require('../controllers/usersController')
const { registerUserSchema } = require('../validations/userValidator')

const testHandler = async (req, res) => {
    const getUser = await getDataController.testDulu()
    return res.status(200).send({
        msg: 'success',
        data: getUser
    })
}

const registerHandler = async (req, res) => {
    const cekBody = registerUserSchema.validate(req.body)
    if (cekBody.error) return res.status(400).send({ error: cekBody.error.details[0].message })
    
    const { fullname, username, email, password } = req.body
    const payload = { fullname, username, email, password }
    
    const register = await registerUserController(payload)
    if (register == 'username not availabe') return res.status(401).send({status: 'failed', msg: 'username not available'})
    if (register == 'email not available') return res.status(401).send({status: 'failed', msg: 'email not available'})
    return res.status(201).send({status: 'success',msg: 'registrasi berhasil'})
}

module.exports = { testHandler, registerHandler }
