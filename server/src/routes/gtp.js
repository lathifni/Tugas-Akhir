var express = require('express');
const { getInfoHandler, getGeomHandler } = require('../handlers/gtpHandler');

var router = express.Router();

router.get('/', getInfoHandler)
router.get('/geom', getGeomHandler)

module.exports = router;
