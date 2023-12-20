const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
const { getUserByEmailAndGoogle, storeRefreshToken, checkAvailableEmailAndGoogle, createDataUserByGoogleOAuth, checkAvailableRefreshToken, deleteRefreshToken } = require('../services/users');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/api/oauth2/google/callback'
  );

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

const authorizationUrlLogin = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state: 'login'
})

const authorizationUrlRegister = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    prompt: 'consent',
    state: 'register'
})

const authUrlLoginGoogleController = async () => {
    return authorizationUrlLogin
}

const authUrlRegisterGoogleController = async() => {
    return authorizationUrlRegister
}

const callBackGoogleByPass = async (req, res) => {
    const { code, state } = req.query

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    })
    const { data } = await oauth2.userinfo.get();

    const { name, email, picture } = data
    const { access_token } = tokens

    const accessTokenJwtL = jwt.sign({  access_token, email }, process.env.SAFETY_GOOGLE_TOKEN_SECRET, { expiresIn: '5s' })
    const accessTokenJwtR = jwt.sign({  name, email, picture }, process.env.SAFETY_GOOGLE_TOKEN_SECRET, { expiresIn: '5s' })

    if (state == 'register') return res.redirect(`/oauth2/google/callback/register?accessTokenJwtR=${accessTokenJwtR}`)
    else return res.redirect(`/oauth2/google/callback/login?accessTokenJwtL=${accessTokenJwtL}`)
}

const loginGoogleController = async (payload) => {
    let email, accessTokenByGoogle
    jwt.verify(payload.accessTokenJwtL, process.env.SAFETY_GOOGLE_TOKEN_SECRET, (err, decoded) => {
        if (err) return false
        accessTokenByGoogle = decoded.access_token
        email = decoded.email
    })

    const user = await getUserByEmailAndGoogle({email})
    if (!user) return 'not registered'

    const { id,user_image } = user
    const accessToken = jwt.sign({ id,email,google,user_image }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
    const refreshToken = jwt.sign({ id,email,google,user_image }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})
    await storeRefreshToken({ refreshToken, email, google:1 })

    return { accessToken, refreshToken, accessTokenByGoogle }
}

const registerGoogleController = async (payload) => {
    let email, name, user_image 
    jwt.verify(payload.accessTokenJwtR, process.env.SAFETY_GOOGLE_TOKEN_SECRET, (err, decoded) => {
        if (err) return false
        name = decoded.name
        email = decoded.email
        user_image = decoded.picture
    })

    const availableEmailAndGoogle = await checkAvailableEmailAndGoogle({email})
    if (!availableEmailAndGoogle) return 'Email is registered, please login'

    const params = { email, fullname: name, user_image, google:1 }
    return await createDataUserByGoogleOAuth(params)
}

const logoutGoogleController = async (payload) => {
    const checkIdUser = await checkAvailableRefreshToken(payload) 
    if (!checkIdUser) return false

    if (payload.accessTokenByGoogle !== undefined) oauth2Client.revokeToken(payload.accessTokenByGoogle)

    return deleted = await deleteRefreshToken(checkIdUser)
}

const signInGoogleController = async (payload) => {
    try {
        const { name, email, picture } = payload
        const availableEmailAndGoogle = await checkAvailableEmailAndGoogle({email})
        if (availableEmailAndGoogle) await createDataUserByGoogleOAuth({ email, fullname: name, user_image: picture, google: 1 })
    
        const user = await getUserByEmailAndGoogle({email})
        const { id,user_image } = user
        const accessToken = jwt.sign({ id,email,google,user_image }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        const refreshToken = jwt.sign({ id,email,google,user_image }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})
        await storeRefreshToken({ refreshToken, email, google:1 })

        return { accessToken, refreshToken, id, email, user_image, name,  google:1 }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    authUrlRegisterGoogleController, authUrlLoginGoogleController, callBackGoogleByPass, registerGoogleController, logoutGoogleController, loginGoogleController,
    signInGoogleController
}