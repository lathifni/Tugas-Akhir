var express = require('express');
const { loginHandler, updateTokenHandler, logoutHandler } = require('../handlers/authHandler');
const { refreshTokenController } = require('../controllers/authController');
var router = express.Router();

router.post('/login', loginHandler)
router.get('/token', updateTokenHandler)
router.get('/logout', logoutHandler)

module.exports = router;
