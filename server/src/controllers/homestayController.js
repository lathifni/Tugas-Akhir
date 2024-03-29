const { listGeomHomestay, listHomestayByRadius, listAllHomestay } = require("../services/homestay.js")

const listGeomHomestayController = async() => {
  return await listGeomHomestay()
}

const listHomestayByRadiusController = async(payload) => {
  return await listHomestayByRadius(payload)
}

const listAllHomestayController = async() => {
  return await listAllHomestay()
}

module.exports = { listGeomHomestayController, listHomestayByRadiusController, listAllHomestayController }