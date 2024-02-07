var express = require('express');
const { postReservation } = require('../handlers/reservationHandler');

var router = express.Router();

router.post('/process-transaction', postReservation)

module.exports = router;