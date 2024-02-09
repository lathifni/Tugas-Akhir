var express = require('express');
const { createReservationHandler } = require('../handlers/reservationHandler');

var router = express.Router();

router.post('/process-transaction', createReservationHandler)

module.exports = router;