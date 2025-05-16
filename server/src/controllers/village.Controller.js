const { listVillage, getUlakanVillage, getEstuaryGeom } = require("../services/village")

const listVillageController = async() => {
  return await listVillage()
}

const getUlakanVillageController = async() => {
  return await getUlakanVillage()
}

const getEstuaryGeomController = async() => {
  return await getEstuaryGeom()
}

module.exports = { listVillageController, getUlakanVillageController, getEstuaryGeomController, }