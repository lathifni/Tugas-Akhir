var express = require('express');
const { listGeomCulinaryHandler, listCulinaryByRadiusHandler, listAllCulinaryHandler } = require('../handlers/culinaryHandler');

var router = express.Router();

router.get('/geom', listGeomCulinaryHandler)
router.get('/listByRadius', listCulinaryByRadiusHandler)
router.get('/all', listAllCulinaryHandler)

module.exports = router;
