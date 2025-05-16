var express = require('express');
const { registerHandler, allAdminHandler, allCostumerHandler, detailByIdHandler, updateUserInformationHandler, newAdminHandler, deleteAdminHandler } = require('../handlers/usersHandler');
const { verifyToken } = require('../middlewares/security/verifyToken');
var router = express.Router();

// router.get('/', verifyToken, testHandler)
router.post('/register', registerHandler)
router.get('/allAdmin', allAdminHandler)
router.get('/allCostumer', allCostumerHandler)
router.get('/detail/:id', detailByIdHandler)
router.put('/update-user-information', updateUserInformationHandler)
router.post('/new-admin', newAdminHandler)
router.delete('/delete-admin/:id', deleteAdminHandler)

module.exports = router;
