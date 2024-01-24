const { estuaryGeomAttraction, trackingGeomAttraction, tripGeomAttraction, makamGeomAttraction, waterListGeomAttraction, cultureListGeomAttraction } = require("../services/attraction")

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

module.exports = { estuaryGeomAttractionController, trackingGeomAttractionController, tripGeomAttractionController, makamGeomAttractionController, waterListGeomAttractionController,
cultureListGeomAttractionController, }