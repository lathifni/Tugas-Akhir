var express = require('express');
const { createReservationHandler, getListReservationByUserIdHandler } = require('../handlers/reservationHandler');

var router = express.Router();

router.post('/process-transaction', createReservationHandler)
router.get('/:id', getListReservationByUserIdHandler)

module.exports = router;