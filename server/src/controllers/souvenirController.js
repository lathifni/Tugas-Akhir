const { listGeomSouvenir, listSouvenirByRadius, listAllSouvenir } = require("../services/souvenir")

const listGeomSouvenirController = async() => {
  return await listGeomSouvenir()
}

const listSouvenirByRadiusController = async(payload) => {
  return await listSouvenirByRadius(payload)
}

const listAllSouvenirController = async() => {
  return await listAllSouvenir()
}

module.exports = { listGeomSouvenirController, listSouvenirByRadiusController, listAllSouvenirController, }