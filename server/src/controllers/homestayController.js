const { listGeomHomestay, listHomestayByRadius } = require("../services/homestay.js")

const listGeomHomestayController = async() => {
  return await listGeomHomestay()
}

const listHomestayByRadiusController = async(payload) => {
  return await listHomestayByRadius(payload)
}

module.exports = { listGeomHomestayController, listHomestayByRadiusController, }