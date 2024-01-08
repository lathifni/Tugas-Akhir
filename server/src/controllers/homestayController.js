const { listGeomHomestay } = require("../services/homestay.js")

const listGeomHomestayController = async() => {
  return await listGeomHomestay()
}

module.exports = { listGeomHomestayController, }