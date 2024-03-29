const bcrypt = require('bcrypt')
const { createDataUser, checkAvailablelUsername, checkAvailableEmail, getAllAdminUser, getAllCostumer } = require('../services/users')

const registerUserController = async (payload) => {
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

const allAdminController = async() => {
    return await getAllAdminUser()
}

const allCostumerController = async() => {
    return await getAllCostumer()
}

module.exports = { registerUserController, allAdminController, allCostumerController, }