const { listGeomHomestayController, listHomestayByRadiusController } = require("../controllers/homestayController");

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

module.exports = { listGeomHomestayHandler, listHomestayByRadiusHandler }