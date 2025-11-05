const bcrypt = require('bcrypt')
const promisePool = require('../../config/database')
const { createDataUser, checkAvailablelUsername, checkAvailableEmail, getAllAdminUser, getAllCostumer, updateUserInformation, addAdmin, checkAvailableUsernameEmail, updateUserDetail, updatePassword } = require('../services/users')

const registerUserControllerLama = async (payload) => {
    const { fullname, username, email, password, phone, address } = payload

    const availabelUsername = await checkAvailablelUsername({username})
    if (!availabelUsername) return 'username not availabe'

    const availableEmail = await checkAvailableEmail({email})
    if (!availableEmail) return 'email not available'
    
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    const params = { fullname, username, email, hashPassword, phone, address }
    return await createDataUser(params)
}

const registerUserController = async (params) => {
    return await updateUserDetail(params)
}

const allAdminController = async() => {
    return await getAllAdminUser()
}

const allCostumerController = async() => {
    return await getAllCostumer()
}

const updateUserInformationController = async(params) => {
    const { fullname, address, phone, id } = params
    if (id && fullname && address && phone) {
        return await updateUserInformation(params)
    }
    return console.log(params);
}

const newAdminController = async(params) => {
    const checkAvailable = await checkAvailableUsernameEmail(params)
    if (checkAvailable.length > 0) {
        return 0
    }
    const password = '@AdminGtp123'
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    params.hashPassword = hashPassword
    params.role_id = 1
    return addAdmin(params)
}

const updatePasswordController = async(params) => {
    const { userId, currentPassword, newPassword } = params;

  // 1. Ambil hash password saat ini dari database
  const [rows] = await promisePool.query(
    `SELECT password_hash FROM users WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404; // Not Found
    throw error;
  }

  const currentHash = rows[0].password_hash;
  if (!currentHash) {
     const error = new Error('User does not have a password set (possibly Google login)');
     error.statusCode = 400; // Bad Request
     throw error;
  }


  // 2. Verifikasi password saat ini
  const isMatch = await bcrypt.compare(currentPassword, currentHash);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.statusCode = 401; // Unauthorized (atau 400 Bad Request)
    throw error;
  }

  // 3. Hash password baru
  const saltRounds = 10; // Sesuaikan cost factor jika perlu
  const newHash = await bcrypt.hash(newPassword, saltRounds);

  // 4. Panggil service untuk update ke database
  const affectedRows = await updatePassword({ userId, newHash });

  if (affectedRows === 0) {
     const error = new Error('Failed to update password in database');
     error.statusCode = 500; // Internal Server Error
     throw error;
  }

  // Controller tidak perlu return apa-apa jika sukses, cukup lempar error jika gagal
  return;
}

module.exports = { 
    registerUserController, allAdminController, allCostumerController
    , updateUserInformationController, newAdminController, updatePasswordController,
}