const { createReservationController, getListReservationByUserIdController, getReservationByIdController } = require("../controllers/reservationController");

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

module.exports = { createReservationHandler, getListReservationByUserIdHandler, getReservationByIdHandler, };
