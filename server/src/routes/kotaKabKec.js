var express = require('express');
const { listGeomKotaKabHandler, listGeomKecHandler } = require('../handlers/kotaKabKecHandler');

var router = express.Router();

router.get('/kotaKab', listGeomKotaKabHandler)
router.get('/kec', listGeomKecHandler)

module.exports = router;
