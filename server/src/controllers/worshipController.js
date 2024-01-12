const { listGeomWorship, listWorshipByRadius } = require("../services/worship")

const listGeomWorshipController = async() => {
  return await listGeomWorship()
}

const listWorshipByRadiusController = async(payload) => {
  return await listWorshipByRadius(payload)
}

module.exports = { listGeomWorshipController, listWorshipByRadiusController }