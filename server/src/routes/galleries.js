var express = require('express');
const { galleriesGtpHandler } = require('../handlers/galleriesHandler');

var router = express.Router();

router.get('/gtp', galleriesGtpHandler)

module.exports = router;
