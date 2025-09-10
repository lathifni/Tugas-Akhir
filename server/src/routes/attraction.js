var express = require('express');
const { estuaryGeomAttractionHandler, trackingGeomAttractionHandler, tripGeomAttractionHandler, makamGeomAttractionHandler, waterListGeomAttractionHandler, cultureListGeomAttractionHandler, listGeomAttractionHandler, getAttractionByIdHandler, listAllAttractionHandler, listAttractionyByRadiusHandler, listUniqueAttractionyByRadiusHandler } = require('../handlers/attractionHandler');

var router = express.Router();

router.get('/', listAllAttractionHandler)
router.get('/estuary', estuaryGeomAttractionHandler)
router.get('/tracking', trackingGeomAttractionHandler)
router.get('/trip', tripGeomAttractionHandler)
router.get('/makam', makamGeomAttractionHandler)
router.get('/water', waterListGeomAttractionHandler)
router.get('/culture', cultureListGeomAttractionHandler)
router.get('/geom', listGeomAttractionHandler)
router.get('/listByRadius', listAttractionyByRadiusHandler)
router.get('/unique/listByRadius', listUniqueAttractionyByRadiusHandler)
router.get('/:id', getAttractionByIdHandler)

module.exports = router;