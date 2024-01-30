var express = require('express');
const { getAllBasePackageHandler } = require('../handlers/packageHandler');

var router = express.Router();

router.get('/listAllBasePackage', getAllBasePackageHandler)

module.exports = router;
