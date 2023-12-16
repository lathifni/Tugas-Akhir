const bcrypt = require('bcrypt')
const { createDataUser, checkAvailablelUsername, checkAvailableEmail } = require('../services/users')

const registerUserController = async (payload) => {
    const { fullname, username, email, password } = payload

    const availabelUsername = await checkAvailablelUsername({username})
    if (!availabelUsername) return 'username not availabe'

    const availableEmail = await checkAvailableEmail({email})
    if (!availableEmail) return 'email not available'
    
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    const params = { fullname, username, email, hashPassword }
    return await createDataUser(params)
}

const check = async (payload) => {

}

module.exports = { registerUserController,  }