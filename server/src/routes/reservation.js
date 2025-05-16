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
  createInvoiceHandler,
  refundHandler,
  refundAdminProofHandler,
  refundConfirmationHandler,
  cancelHandler,
  homestayUnitByReservationIdHandler,
  createReviewPackageHandler,
  createReviewHomestayHandler,
  deleteReservationByIdHandler,
} = require("../handlers/reservationHandler");

var router = express.Router();

router.post("/process-transaction", createReservationHandler);
router.post("/callback/notification", callbacNotificationkHandler);
router.get("/all", getAllReservationHandler);
router.get("/:id", getListReservationByUserIdHandler);
router.get("/reservationById/:id", getReservationByIdHandler);
router.get("/callback/redirect", callbackRedirectHandler);
router.get("/confirmationDate/:id/:confirmation", confirmationDateHandler);
router.get("/homestay-unit/:id", homestayUnitByReservationIdHandler);
router.post("/booking-homestay", bookingHomestayByReservationIdHandler);
router.post('/review-homestay', createReviewHomestayHandler)
router.post('/review-package', createReviewPackageHandler)
router.post('/invoice', createInvoiceHandler)
router.post('/refund', refundHandler)
router.post('/cancel', cancelHandler)
router.put('/refund/adminproof', refundAdminProofHandler)
router.put('/refund/confirmation', refundConfirmationHandler)
router.delete("/:id", deleteReservationByIdHandler)

module.exports = router;
