const { listGeomCulinaryController } = require("../controllers/culinaryController");

const listGeomCulinaryHandler = async(req, res) => {
  try {
    const geom = await listGeomCulinaryController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomCulinaryHandler, }