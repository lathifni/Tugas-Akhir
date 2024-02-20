var express = require('express');
const { createReservationHandler, getListReservationByUserIdHandler, getReservationByIdHandler } = require('../handlers/reservationHandler');

var router = express.Router();

router.post('/process-transaction', createReservationHandler)
router.get('/:id', getListReservationByUserIdHandler)
router.get('/reservationById/:id', getReservationByIdHandler)

module.exports = router;