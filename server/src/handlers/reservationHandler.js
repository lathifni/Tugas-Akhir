const { createReservationController, getListReservationByUserIdController, getReservationByIdController, callbackRedirectController, callbackNotificationController, getAllReservationController, confirmationDateController, bookingHomestayByReservationIdController, createReviewController, createInvoiceController, refundController, refundAdminProofController, refundConfirmationController, cancelController, homestayUnitByReservationIdController, createReviewPackageController, createReviewHomestayController, deleteReservationByIdController } = require("../controllers/reservationController");

const createReservationHandler = async (req, res) => {
  try {
    const response = await createReservationController(req.body)
  
    if (response.status !== 201) return res.status(500).send({ status: 'error', message: 'failed to create reservation'})
    return res.status(201).send({  status:'success', idReservation: response.idReservation })
  } catch (error) {
    console.log(error); 
  }
}

const confirmationDateHandler = async(req, res) => {
  try {
    await confirmationDateController(req.params)
  
    return res.status(200).send({ status:'success' })
  } catch (error) {
    console.log(error);
  }
}

const homestayUnitByReservationIdHandler = async(req, res) => {
  try {
    const list = await homestayUnitByReservationIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getListReservationByUserIdHandler = async(req, res) => {
  try {
    const list = await getListReservationByUserIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const getReservationByIdHandler = async(req, res) => {
  try {
    const list = await getReservationByIdController(req.params)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const callbacNotificationkHandler = async(req, res) => {
  try {
    // kalau transaction_status nya itu adalah capture dan settlement tu dah aman anggap dah berhasil dibayar
    await callbackNotificationController(req.body)

    res.status(200).json({ status: 'success', message: 'ok' })
  } catch (error) {
    console.log(error);
  }
}

const callbackRedirectHandler = async(req, res) => {
  try {
    const idReservation = await callbackRedirectController(req.query)

    res.status(200).json({ status: 'success', data: idReservation })
  } catch (error) {
    console.log(error);
  }
}

const getAllReservationHandler = async(req, res) => {
  try {
    const data = await getAllReservationController()

    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const bookingHomestayByReservationIdHandler = async(req, res) => {
  try {
    const save = await bookingHomestayByReservationIdController(req.body)

    res.status(200).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const createReviewPackageHandler = async(req, res) => {
  try {
    const save = await createReviewPackageController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const createReviewHomestayHandler = async(req, res) => {
  try {
    const save = await createReviewHomestayController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const createInvoiceHandler = async(req, res) => {
  try {    
    const pdfData = await createInvoiceController(req.body);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
      'Content-Length': pdfData.length,
    });
    res.end(pdfData);
  } catch (error) {
    console.log(error);
  }
}

const refundHandler = async(req, res) => {
  try {
    const save = await refundController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const cancelHandler = async(req, res) => {
  try {
    const save = await cancelController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const refundAdminProofHandler = async(req, res) => {
  try {
    const save = await refundAdminProofController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const refundConfirmationHandler = async(req, res) => {
  try {
    const save = await refundConfirmationController(req.body)

    res.status(201).json({ status: 'success', data: save })
  } catch (error) {
    console.log(error);
  }
}

const deleteReservationByIdHandler = async(req, res) => {
  try {
    const deleteRow = await deleteReservationByIdController(req.params)
    if (deleteRow == 1) return res.status(200).send({ status:'success' })
    else return res.status(400).send({ status:'failed to add data',  })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createReservationHandler, confirmationDateHandler, getListReservationByUserIdHandler, getReservationByIdHandler
  , callbacNotificationkHandler, callbackRedirectHandler, getAllReservationHandler, bookingHomestayByReservationIdHandler
  , createReviewPackageHandler, createInvoiceHandler, refundHandler, refundAdminProofHandler, refundConfirmationHandler
  , cancelHandler, homestayUnitByReservationIdHandler, createReviewHomestayHandler, deleteReservationByIdHandler, };
