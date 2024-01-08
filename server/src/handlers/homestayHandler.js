const { listGeomHomestayController } = require("../controllers/homestayController");

const listGeomHomestayHandler = async(req, res) => {
  try {
    const geom = await listGeomHomestayController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomHomestayHandler, }