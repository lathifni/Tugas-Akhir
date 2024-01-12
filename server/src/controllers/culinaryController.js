const { listGeomCulinary, listCulinaryByRadius } = require("../services/culinary")

const listGeomCulinaryController = async() => {
  return await listGeomCulinary()
}

const listCulinaryByRadiusController = async(payload) => {
  return await listCulinaryByRadius(payload)
}

module.exports = { listGeomCulinaryController, listCulinaryByRadiusController }