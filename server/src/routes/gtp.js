var express = require('express');
const { getInfoHandler } = require('../handlers/gtpHandler');

var router = express.Router();

router.get('/', getInfoHandler)

module.exports = router;
