var express = require('express');
const { listGeomHomestayHandler, listHomestayByRadiusHandler } = require('../handlers/homestayHandler');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler)
router.get('/listByRadius', listHomestayByRadiusHandler)

module.exports = router;
