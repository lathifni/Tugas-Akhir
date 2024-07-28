const { listGeomHomestayController, listHomestayByRadiusController, listAllHomestayController, availableHomestayController, bookedHomestayController } = require("../controllers/homestayController");

const listGeomHomestayHandler = async(req, res) => {
  try {
    const geom = await listGeomHomestayController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listHomestayByRadiusHandler = async(req, res) => {
  try {
    const list = await listHomestayByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllHomestayHandler = async(req, res) => {
  try {
    const list = await listAllHomestayController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const availableHomestayHandler = async(req, res) => {
  try {
    const data = await availableHomestayController(req.query)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

const bookedHomestayHandler = async(req, res) => {
  try {
    const data = await bookedHomestayController(req.params)

    return res.status(200).send({ status:'success', data:data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomHomestayHandler, listHomestayByRadiusHandler, listAllHomestayHandler, availableHomestayHandler, bookedHomestayHandler
  , 
 }