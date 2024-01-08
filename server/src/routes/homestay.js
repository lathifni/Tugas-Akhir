var express = require('express');
const { listGeomHomestayHandler } = require('../handlers/homestayHandler');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler)

module.exports = router;
