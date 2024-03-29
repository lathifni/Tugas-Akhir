var express = require('express');
const { registerHandler, allAdminHandler, allCostumerHandler } = require('../handlers/usersHandler');
const { verifyToken } = require('../middlewares/security/verifyToken');
var router = express.Router();

// router.get('/', verifyToken, testHandler)
router.post('/register', registerHandler)
router.get('/allAdmin', allAdminHandler)
router.get('/allCostumer', allCostumerHandler)

module.exports = router;
