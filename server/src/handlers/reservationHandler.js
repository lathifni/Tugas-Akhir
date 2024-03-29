const { createReservationController, getListReservationByUserIdController, getReservationByIdController, callbackRedirectController, callbackNotificationController, getAllReservationController } = require("../controllers/reservationController");

const createReservationHandler = async (req, res) => {
  const response = await createReservationController(req.body)

  if (response.status !== 201) return res.status(500).send({ status: 'error', message: 'failed to create reservation'})
  return res.status(201).send({ token: response.token })
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

module.exports = { createReservationHandler, getListReservationByUserIdHandler, getReservationByIdHandler, callbacNotificationkHandler, callbackRedirectHandler, 
getAllReservationHandler, };
