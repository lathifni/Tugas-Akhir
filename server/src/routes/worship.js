var express = require('express');
const { listGeomWorshipHandler, listWorshipByRadiusHandler } = require('../handlers/worshipHandler');

var router = express.Router();

router.get('/geom', listGeomWorshipHandler)
router.get('/listByRadius', listWorshipByRadiusHandler)

module.exports = router;
