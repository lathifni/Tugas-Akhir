const { listVillageController, getUlakanVillageController } = require("../controllers/village.Controller.js");

const listVillageHandler = async(req, res) => {
  try {
    const listVillage = await listVillageController()

    return res.status(200).send({ status:'success', data: listVillage })
  } catch (error) {
    console.log(error);
  }
}

const getUlakanVillageHandler = async(req, res) => {
  try {
    const ulakan = await getUlakanVillageController()

    return res.status(200).send({ status:'success', data: ulakan })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listVillageHandler, getUlakanVillageHandler, }