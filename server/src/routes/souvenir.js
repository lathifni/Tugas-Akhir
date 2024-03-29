var express = require('express');
const { listGeomSouvenirHandler, listSouvenirByRadiusHandler, listAllSouvenirHandler } = require('../handlers/souvenirHandler');

var router = express.Router();

router.get('/geom', listGeomSouvenirHandler)
router.get('/listByRadius', listSouvenirByRadiusHandler)
router.get('/all', listAllSouvenirHandler)

module.exports = router;
