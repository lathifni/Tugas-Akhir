const { listGeomCulinaryController, listCulinaryByRadiusController } = require("../controllers/culinaryController");

const listGeomCulinaryHandler = async(req, res) => {
  try {
    const geom = await listGeomCulinaryController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listCulinaryByRadiusHandler = async(req, res) => {
  try {
    const list = await listCulinaryByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomCulinaryHandler,listCulinaryByRadiusHandler }