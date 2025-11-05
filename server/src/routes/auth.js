var express = require('express');
const { loginHandler, updateTokenHandler, logoutHandler } = require('../handlers/authHandler');
var router = express.Router();

router.post('/login', loginHandler)
router.post('/token', updateTokenHandler)
router.get('/logout', logoutHandler)
router.put('/change-password', logoutHandler)

module.exports = router;
