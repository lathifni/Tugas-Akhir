var express = require('express');
const { listVillageHandler } = require('../handlers/villageHandler');

var router = express.Router();

router.get('/', listVillageHandler)

module.exports = router;
