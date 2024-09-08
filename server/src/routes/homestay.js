var express = require('express');
const { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler, availableHomestayHandler, bookedHomestayHandler, getHomestayByIdHandler } = require('../handlers/homestayHandler');
const { route } = require('./culinary');

var router = express.Router();

router.get('/geom', listGeomHomestayHandler)
router.get('/listByRadius', listHomestayByRadiusHandler)
router.get('/all', listAllHomestayHandler)
router.get('/available-homestay', availableHomestayHandler)
router.get('/booked-homestay/:id', bookedHomestayHandler)
router.get('/:id', getHomestayByIdHandler)

module.exports = router;
