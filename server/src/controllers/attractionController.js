const { estuaryGeomAttraction, trackingGeomAttraction, tripGeomAttraction, makamGeomAttraction, waterListGeomAttraction, cultureListGeomAttraction, listGeomAttractions, getAttractionById, listAllAttractions, listAttractionByRadius, listUniqueAttractionByRadius } = require("../services/attraction")

const listAllAttractionController = async() => {
  return await listAllAttractions()
}

const listGeomAttractionController = async() => {
  return await listGeomAttractions()
}
const estuaryGeomAttractionController = async() => {
  return await estuaryGeomAttraction()
}

const trackingGeomAttractionController = async() => {
  return await trackingGeomAttraction()
}

const tripGeomAttractionController = async() => {
  return await tripGeomAttraction()
}

const makamGeomAttractionController = async() => {
  return await makamGeomAttraction()
}

const waterListGeomAttractionController = async() => {
  return await waterListGeomAttraction()
}

const cultureListGeomAttractionController = async() => {
  return await cultureListGeomAttraction()
}

const getAttractionByIdController = async(params) => {
  return await getAttractionById(params)
}

const listAttractionByRadiusController = async(payload) => {
  return await listAttractionByRadius(payload)
}

const listUniqueAttractionByRadiusController = async(payload) => {
  return await listUniqueAttractionByRadius(payload)
}

module.exports = { listAllAttractionController, listGeomAttractionController, estuaryGeomAttractionController, trackingGeomAttractionController, tripGeomAttractionController, makamGeomAttractionController, waterListGeomAttractionController,
cultureListGeomAttractionController, getAttractionByIdController, listAttractionByRadiusController, listUniqueAttractionByRadiusController }