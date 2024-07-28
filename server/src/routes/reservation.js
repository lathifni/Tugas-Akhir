var express = require("express");
const {
  createReservationHandler,
  getListReservationByUserIdHandler,
  getReservationByIdHandler,
  callbacNotificationkHandler,
  callbackRedirectHandler,
  getAllReservationHandler,
  confirmationDateHandler,
  bookingHomestayByReservationIdHandler,
} = require("../handlers/reservationHandler");

var router = express.Router();

router.post("/process-transaction", createReservationHandler);
router.post("/callback/notification", callbacNotificationkHandler);
router.get("/all", getAllReservationHandler);
router.get("/:id", getListReservationByUserIdHandler);
router.get("/reservationById/:id", getReservationByIdHandler);
router.get("/callback/redirect", callbackRedirectHandler);
router.get("/confirmationDate/:id/:confirmation", confirmationDateHandler);
router.post("/booking-homestay", bookingHomestayByReservationIdHandler);

module.exports = router;
