const users = require('./users')
const oauthGoogle = require('./oAuth2')
const auth = require('./auth')
const gtp = require('./gtp')
const galeries = require('./galleries')

const router = {}

router.users = users
router.oauthGoogle = oauthGoogle
router.auth = auth
router.gtp = gtp
router.galeries = galeries

module.exports = router