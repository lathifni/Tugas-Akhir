var express = require('express');
const { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler, availableHomestayHandler, bookedHomestayHandler } = require('../handlers/homestayHandler');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler)
router.get('/listByRadius', listHomestayByRadiusHandler)
router.get('/all', listAllHomestayHandler)
router.get('/available-homestay', availableHomestayHandler)
router.get('/booked-homestay/:id', bookedHomestayHandler)

module.exports = router;
