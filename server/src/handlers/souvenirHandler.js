const { listGeomSouvenirController } = require("../controllers/souvenirController");

const listGeomSouvenirHandler = async(req, res) => {
  try {
    const geom = await listGeomSouvenirController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomSouvenirHandler, }