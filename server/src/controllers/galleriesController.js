const { galleriesGtp, galleriesFacility, galleriesWorship, galleriesCulinary, galleriesSouvenir, galleriesAttraction, galleriesHomestay, galleriesHomestayUnit } = require("../services/galleries")

const galleriesGtpController = async() => {
  return await galleriesGtp()
}

const galleriesFacilityController = async(params) => {
  return await galleriesFacility(params)
}

const galleriesCulinaryController = async(params) => {
  return await galleriesCulinary(params)
}

const galleriesWorshipController = async(params) => {
  return await galleriesWorship(params)
}

const galleriesSouvenirController = async(params) => {
  return await galleriesSouvenir(params)
}

const galleriesAttractionController = async(params) => {
  return await galleriesAttraction(params)
}

const galleriesHomestayController = async(params) => {
  return await galleriesHomestay(params)
}

const galleriesHomestayUnitController = async(params) => {
  return await galleriesHomestayUnit(params)
}

module.exports = { galleriesGtpController, galleriesFacilityController, galleriesCulinaryController, galleriesWorshipController
  , galleriesSouvenirController, galleriesAttractionController, galleriesHomestayController, galleriesHomestayUnitController, }