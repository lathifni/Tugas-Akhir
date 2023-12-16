var express = require('express');
const OAuth2 = require('../controllers/oauthGoogleController')

var router = express.Router();

router.get('/auth/google/', OAuth2.Login)
router.get('/auth/google/callback', OAuth2.CallBackLogin)

module.exports = router