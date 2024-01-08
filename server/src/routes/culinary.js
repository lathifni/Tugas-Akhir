var express = require('express');
const { listGeomCulinaryHandler } = require('../handlers/culinaryHandler');

var router = express.Router();

router.get('/geom', listGeomCulinaryHandler)

module.exports = router;
