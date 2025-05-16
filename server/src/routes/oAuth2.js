var express = require('express');
const { callBackGoogleByPass } = require('../controllers/oAuth2Controller');
const { loginGoogleHandler, logoutGoogleHandler, registerGoogleHandler, loginGoogleCallBackHandler, registerGoogleCallBackHandler, signInGoogleHandler, checkAccountGoogle } = require('../handlers/oAuth2Handler');

var router = express.Router();

router.get('/google/register', registerGoogleHandler)
router.get('/google/callback/register', registerGoogleCallBackHandler)
router.get('/google/login', loginGoogleHandler)
router.get('/google/callback/login', loginGoogleCallBackHandler)
router.get('/google/callback', callBackGoogleByPass)
router.get('/google/logout', logoutGoogleHandler)
router.post('/google/frontend', signInGoogleHandler)
router.get('/google/check-account', checkAccountGoogle)

// http://localhost:3000/oauth2/google/
// http://localhost:3000/oauth2/google/callback

module.exports = router