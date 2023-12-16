var express = require('express');
const { testHandler, registerHandler } = require('../handlers/usersHandler');
const { verifyToken } = require('../middlewares/security/verifyToken');
var router = express.Router();

router.get('/', verifyToken, testHandler)
router.post('/register', registerHandler)

module.exports = router;
