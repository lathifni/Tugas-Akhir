var express = require('express');
const { listGeomWorshipHandler, listWorshipByRadiusHandler, listAllWorshipHandler } = require('../handlers/worshipHandler');

var router = express.Router();

router.get('/geom', listGeomWorshipHandler)
router.get('/listByRadius', listWorshipByRadiusHandler)
router.get('/all', listAllWorshipHandler)

module.exports = router;
