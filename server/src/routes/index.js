const users = require('./users')
const oauthGoogle = require('./oauthGoogle')
const auth = require('./auth')

const router = {}

router.users = users
router.oauthGoogle = oauthGoogle
router.auth = auth

module.exports = router