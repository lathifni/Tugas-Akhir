const { listGeomSouvenir, listSouvenirByRadius } = require("../services/souvenir")

const listGeomSouvenirController = async() => {
  return await listGeomSouvenir()
}

const listSouvenirByRadiusController = async(payload) => {
  return await listSouvenirByRadius(payload)
}

module.exports = { listGeomSouvenirController, listSouvenirByRadiusController, }