var express = require('express');
const { galleriesGtpHandler, galleriesFacilityHandler, galleriesWorshipHandler, galleriesCulinaryHandler, galleriesSouvenirHandler } = require('../handlers/galleriesHandler');

var router = express.Router();

router.get('/gtp', galleriesGtpHandler)
router.get('/facility/:id', galleriesFacilityHandler)
router.get('/culinary/:id', galleriesCulinaryHandler)
router.get('/worship/:id', galleriesWorshipHandler)
router.get('/souvenir/:id', galleriesSouvenirHandler)

module.exports = router;
