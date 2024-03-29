const { listGeomWorship, listWorshipByRadius, listAllWorship } = require("../services/worship")

const listGeomWorshipController = async() => {
  return await listGeomWorship()
}

const listWorshipByRadiusController = async(payload) => {
  return await listWorshipByRadius(payload)
}

const listAllWorshipController = async() => {
  return await listAllWorship()
}

module.exports = { listGeomWorshipController, listWorshipByRadiusController, listAllWorshipController }