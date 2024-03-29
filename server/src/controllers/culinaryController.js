const { listGeomCulinary, listCulinaryByRadius, listAllCulinary } = require("../services/culinary")

const listGeomCulinaryController = async() => {
  return await listGeomCulinary()
}

const listCulinaryByRadiusController = async(payload) => {
  return await listCulinaryByRadius(payload)
}

const listAllCulinaryController = async() => {
  return await listAllCulinary()
}

module.exports = { listGeomCulinaryController, listCulinaryByRadiusController, listAllCulinaryController, }