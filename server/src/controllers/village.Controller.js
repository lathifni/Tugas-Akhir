const { listVillage } = require("../services/village")

const listVillageController = async() => {
  return await listVillage()
}

module.exports = { listVillageController, }