var express = require('express');
const { galleriesGtpHandler, galleriesFacilityHandler, galleriesWorshipHandler, galleriesCulinaryHandler, galleriesSouvenirHandler, galleriesAttractionHandler, galleriesHomestayHandler, galleriesHomestayUnitHandler } = require('../handlers/galleriesHandler');

var router = express.Router();

router.get('/gtp', galleriesGtpHandler)
router.get('/facility/:id', galleriesFacilityHandler)
router.get('/culinary/:id', galleriesCulinaryHandler)
router.get('/worship/:id', galleriesWorshipHandler)
router.get('/souvenir/:id', galleriesSouvenirHandler)
router.get('/attraction/:id', galleriesAttractionHandler)
router.get('/homestay/:id/unit', galleriesHomestayUnitHandler)
router.get('/homestay/:id', galleriesHomestayHandler)

module.exports = router;
