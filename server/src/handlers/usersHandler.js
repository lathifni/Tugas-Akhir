const { registerUserController, allAdminController, allCostumerController, updateUserInformationController, newAdminController, updatePasswordController } = require('../controllers/usersController')
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

const updatePasswordHandler = async(req, res) => {
    try {
        console.log(req.body);
        
    // 1. Ambil User ID dari sesi/token (SANGAT PENTING!)
    //    Ganti 'req.user.id' sesuai cara kamu menyimpan ID user yang terautentikasi
    const userId = req.body?.id;
    if (!userId) {
      return res.status(401).send({ status: 'failed', message: 'Unauthorized' });
    }

    // 2. Ambil password dari body request
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ status: 'failed', message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 8) {
       return res.status(400).send({ status: 'failed', message: 'New password must be at least 8 characters long' });
    }


    // 3. Panggil controller dengan data yang diperlukan
    await updatePasswordController({ userId, currentPassword, newPassword });

    // 4. Kirim respons sukses (204 No Content biasanya tidak punya body)
    //    Gunakan 200 OK jika ingin mengirim status sukses di body
    return res.status(200).send({ status: 'success', message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error in updatePasswordHandler:', error);
    // Kirim pesan error yang spesifik jika ada
    const statusCode = error.statusCode || 400; // Default ke 400 Bad Request
    return res.status(statusCode).send({ status: 'failed', message: error.message || 'Failed to update password' });
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
    , updateUserInformationHandler, newAdminHandler, deleteAdminHandler, updatePasswordHandler,
}
