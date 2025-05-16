const { authUrlLoginGoogleController, logoutGoogleController, authUrlRegisterGoogleController, loginGoogleController, registerGoogleController, signInGoogleController } = require("../controllers/oAuth2Controller");

const registerGoogleHandler = async (req, res) => {
    try {
        const authorizationUrl = await authUrlRegisterGoogleController()
        return res.redirect(authorizationUrl)
    } catch (error) {
        console.log(error);
        return error
    }
}

const loginGoogleHandler = async (req, res) => {
    try {
        const authorizationUrl = await authUrlLoginGoogleController()
        return res.redirect(authorizationUrl)
    } catch (error) {
        console.log(error);
        return error
    }
}

const registerGoogleCallBackHandler = async (req, res) => {
    const register = await registerGoogleController(req.query)
    if (register == 'Email is registered, please login') return res.status(401).send({status: 'failed', msg: 'email is registerd, please login'})

    return res.status(201).send({status: 'success', msg: 'registrasi berhasil'})
}

const loginGoogleCallBackHandler = async (req, res) => {
    const login = await loginGoogleController(req.query)
    if (login == 'not registered') return res.status(404).send({status: 'failed', msg: 'Email not registered'})

    return res.status(200).send({status:'success', accessToken: login.accessToken})
}

const logoutGoogleHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    const accessTokenByGoogle = req.cookies.accessTokenByGoogle

    const token = await logoutGoogleController({ refreshToken, accessTokenByGoogle })
    if (!token) return res.sendStatus(204)

    return res.sendStatus(200)
}

const signInGoogleHandler = async (req, res) => {
    const payload = req.body.profile
    const signIn = await signInGoogleController(payload)
    console.log(signIn);
    
    return res.status(200).send({
        status:'success', 
        user_id: signIn.id,
        accessToken: signIn.accessToken,
        email: signIn.email,
        google: signIn.google,
        user_image: signIn.user_image,
        name: signIn.name,
        refreshToken: signIn.refreshToken,
        role: signIn.role,
        phone: signIn.phone,
    })
}

const checkAccountGoogle = async(req, res) => {
    const payload = req.body.profile
    const signIn = await signInGoogleController(payload)
    console.log(signIn);
}

module.exports = { registerGoogleHandler, registerGoogleCallBackHandler, loginGoogleHandler, loginGoogleCallBackHandler
    ,logoutGoogleHandler, signInGoogleHandler, checkAccountGoogle,  }

