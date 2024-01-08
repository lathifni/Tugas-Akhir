const { listVillage, getUlakanVillage } = require("../services/village")

const listVillageController = async() => {
  return await listVillage()
}

const getUlakanVillageController = async() => {
  return await getUlakanVillage()
}

module.exports = { listVillageController, getUlakanVillageController, }