var express = require('express');
const { createReservationHandler, getListReservationByUserIdHandler, getReservationByIdHandler, callbackHandler, callbacNotificationkHandler, callbackRedirectHandler, getAllReservationHandler, confirmationDateHandler } = require('../handlers/reservationHandler');

var router = express.Router();

router.post('/process-transaction', createReservationHandler)
router.post('/callback/notification', callbacNotificationkHandler )
router.get('/all', getAllReservationHandler)
router.get('/:id', getListReservationByUserIdHandler)
router.get('/reservationById/:id', getReservationByIdHandler)
router.get('/callback/redirect', callbackRedirectHandler)
router.get('/confirmationDate/:id/:confirmation', confirmationDateHandler)

module.exports = router;