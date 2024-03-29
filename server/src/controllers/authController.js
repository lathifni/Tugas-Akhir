const bcrypt = require('bcrypt')
const { getUserByUsernameOrEmail, storeRefreshToken, checkUsesrByRefreshToken, deleteRefreshToken, checkAvailableRefreshToken } = require('../services/users')
const jwt = require('jsonwebtoken')

const loginController = async (payload) => {
    const { emailOrUsername, password } = payload

    const getUser = await getUserByUsernameOrEmail(payload)
    if (!getUser) return 'email or username not found'

    const match = await bcrypt.compare(password, getUser.password_hash)
    if (!match) return 'wrong password'

    const { id, email, google, user_image, fullname, role } = getUser

    const accessToken = jwt.sign({ id,email,google,user_image }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
    const refreshToken = jwt.sign({ id,email,google,user_image }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})
    await storeRefreshToken({ refreshToken, email, google })

    return { accessToken, refreshToken, id, email, google, user_image, fullname, role}
}

const refreshTokenController = async (payload) => {
        const user = await checkUsesrByRefreshToken(payload)
        if(!user) return false 

        jwt.verify(payload.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return false
        })
        const { id, email, google, user_image } = user
        const accessToken = jwt.sign({ id,email,google,user_image }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        return { accessToken }
}

const logoutController = async (payload) => {
    const checkIdUser = await checkAvailableRefreshToken(payload)
    if (!checkIdUser) return false

    return deleted = await deleteRefreshToken(checkIdUser)
}

module.exports = { loginController, refreshTokenController, logoutController }