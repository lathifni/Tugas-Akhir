const { listGeomWorshipController } = require("../controllers/worshipController");


const listGeomWorshipHandler = async(req, res) => {
  try {
    const geom = await listGeomWorshipController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomWorshipHandler, }