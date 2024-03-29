var express = require('express');
const { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler } = require('../handlers/homestayHandler');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler)
router.get('/listByRadius', listHomestayByRadiusHandler)
router.get('/all', listAllHomestayHandler)

module.exports = router;
