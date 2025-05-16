var express = require('express');
const { listVillageHandler, getUlakanVillageHandler, getEstuaryGeomHandler } = require('../handlers/villageHandler');

var router = express.Router();

router.get('/', listVillageHandler)
router.get('/ulakan', getUlakanVillageHandler)
router.get('/estuary', getEstuaryGeomHandler)

module.exports = router;
