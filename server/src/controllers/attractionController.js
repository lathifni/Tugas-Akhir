const { estuaryGeomAttraction, trackingGeomAttraction, tripGeomAttraction, makamGeomAttraction, waterListGeomAttraction, cultureListGeomAttraction, listGeomAttractions, getAttractionById } = require("../services/attraction")


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

module.exports = { listGeomAttractionController, estuaryGeomAttractionController, trackingGeomAttractionController, tripGeomAttractionController, makamGeomAttractionController, waterListGeomAttractionController,
cultureListGeomAttractionController, getAttractionByIdController, }