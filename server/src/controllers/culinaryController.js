const { listGeomCulinary, listCulinaryByRadius } = require("../services/culinary")

const listGeomCulinaryController = async() => {
  return await listGeomCulinary()
}

const listCulinaryByRadiusController = async() => {
  return await listCulinaryByRadius()
}

module.exports = { listGeomCulinaryController, listCulinaryByRadiusController }