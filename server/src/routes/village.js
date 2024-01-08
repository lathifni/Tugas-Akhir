var express = require('express');
const { listVillageHandler, getUlakanVillageHandler } = require('../handlers/villageHandler');

var router = express.Router();

router.get('/', listVillageHandler)
router.get('/ulakan', getUlakanVillageHandler)

module.exports = router;
