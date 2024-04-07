var express = require('express');
const { galleriesGtpHandler, galleriesFacilityHandler } = require('../handlers/galleriesHandler');

var router = express.Router();

router.get('/gtp', galleriesGtpHandler)
router.get('/facility/:id', galleriesFacilityHandler)

module.exports = router;
