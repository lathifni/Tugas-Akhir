var express = require('express');
const { listGeomWorshipHandler } = require('../handlers/worshipHandler');

var router = express.Router();

router.get('/geom', listGeomWorshipHandler)

module.exports = router;
