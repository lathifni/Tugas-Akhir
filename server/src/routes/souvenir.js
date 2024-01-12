var express = require('express');
const { listGeomSouvenirHandler, listSouvenirByRadiusHandler } = require('../handlers/souvenirHandler');

var router = express.Router();

router.get('/geom', listGeomSouvenirHandler)
router.get('/listByRadius', listSouvenirByRadiusHandler)

module.exports = router;
