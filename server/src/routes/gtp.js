var express = require('express');
const { getInfoHandler, getGeomHandler, getAllObjectHandler } = require('../handlers/gtpHandler');

var router = express.Router();

router.get('/', getInfoHandler)
router.get('/geom', getGeomHandler)
router.get('/allObject', getAllObjectHandler)

module.exports = router;
