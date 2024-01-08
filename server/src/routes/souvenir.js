var express = require('express');
const { listGeomSouvenirHandler } = require('../handlers/souvenirHandler');

var router = express.Router();

router.get('/geom', listGeomSouvenirHandler)

module.exports = router;
