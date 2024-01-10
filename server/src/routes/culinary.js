var express = require('express');
const { listGeomCulinaryHandler, listCulinaryByRadiusHandler } = require('../handlers/culinaryHandler');

var router = express.Router();

router.get('/geom', listGeomCulinaryHandler)
router.get('/listByRadius', listCulinaryByRadiusHandler)

module.exports = router;
