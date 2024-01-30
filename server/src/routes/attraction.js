var express = require('express');
const { estuaryGeomAttractionHandler, trackingGeomAttractionHandler, tripGeomAttractionHandler, makamGeomAttractionHandler, waterListGeomAttractionHandler, cultureListGeomAttractionHandler, listGeomAttractionHandler } = require('../handlers/attractionHandler');

var router = express.Router();

router.get('/estuary', estuaryGeomAttractionHandler)
router.get('/tracking', trackingGeomAttractionHandler)
router.get('/trip', tripGeomAttractionHandler)
router.get('/makam', makamGeomAttractionHandler)
router.get('/water', waterListGeomAttractionHandler)
router.get('/culture', cultureListGeomAttractionHandler)
router.get('/geom', listGeomAttractionHandler)

module.exports = router;