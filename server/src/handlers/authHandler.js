const { loginController, refreshTokenController, logoutController } = require("../controllers/authController");
const { loginUserSchema } = require("../validations/auth");

const loginHandler = async (req, res) => {
    const cekBody = loginUserSchema.validate(req.body)
    if (cekBody.error) return res.status(400).send({ status:'failed', error: cekBody.error.details[0].message })

    const login = await loginController(req.body)
    if (login == 'email or username not found') return res.status(404).send({status:'failed', error:'email or username not found'})
    if (login == 'wrong password') return res.status(400).send({status:'failed', error:'wrong password'})
    
    return res.status(200).send({
        status:'success', 
        id: login.id,
        accessToken: login.accessToken,
        email: login.email,
        google: login.google,
        user_image: login.user_image,
        name: login.fullname,
        refreshToken: login.refreshToken
    })
}

const updateTokenHandler = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.sendStatus(401)

    const updateToken = await refreshTokenController({ refreshToken })
    if (!updateToken) return res.sendStatus(403)

    return res.status(200).send({status:'success', accessToken: updateToken.accessToken})
}

const logoutHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    const token = await logoutController({ refreshToken })
    if (!token) return res.sendStatus(204)

    return res.sendStatus(200)
}

module.exports = { loginHandler, updateTokenHandler, logoutHandler }