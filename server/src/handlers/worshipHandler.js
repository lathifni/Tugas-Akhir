const { listGeomWorshipController, listWorshipByRadiusController, listAllWorshipController } = require("../controllers/worshipController");


const listGeomWorshipHandler = async(req, res) => {
  try {
    const geom = await listGeomWorshipController()

    return res.status(200).send({ status:'success', data:geom })
  } catch (error) {
    console.log(error);
  }
}

const listWorshipByRadiusHandler = async(req, res) => {
  try {
    const list = await listWorshipByRadiusController(req.query)

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

const listAllWorshipHandler = async(req, res) => {
  try {
    const list = await listAllWorshipController()

    return res.status(200).send({ status:'success', data:list })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listGeomWorshipHandler, listWorshipByRadiusHandler, listAllWorshipHandler }