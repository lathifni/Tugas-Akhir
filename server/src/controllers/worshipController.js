const { listGeomWorship } = require("../services/worship")

const listGeomWorshipController = async() => {
  return await listGeomWorship()
}

module.exports = { listGeomWorshipController, }