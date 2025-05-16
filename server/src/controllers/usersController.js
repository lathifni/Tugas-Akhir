const bcrypt = require('bcrypt')
const { createDataUser, checkAvailablelUsername, checkAvailableEmail, getAllAdminUser, getAllCostumer, updateUserInformation, addAdmin, checkAvailableUsernameEmail, updateUserDetail } = require('../services/users')

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

module.exports = { 
    registerUserController, allAdminController, allCostumerController
    , updateUserInformationController, newAdminController,
}