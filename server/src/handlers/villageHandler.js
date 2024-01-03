const { listVillageController } = require("../controllers/village.Controller.js");

const listVillageHandler = async(req, res) => {
  try {
    const listVillage = await listVillageController()

    return res.status(200).send({ status:'success', data: listVillage })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listVillageHandler, }