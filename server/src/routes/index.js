const users = require('./users')
const oauthGoogle = require('./oAuth2')
const auth = require('./auth')
const gtp = require('./gtp')
const galeries = require('./galleries')
const event = require('./event')
const village = require('./village')

const router = {}

router.users = users
router.oauthGoogle = oauthGoogle
router.auth = auth
router.gtp = gtp
router.galeries = galeries
router.event = event
router.village = village

module.exports = router