const { galleriesGtp, galleriesFacility, galleriesWorship, galleriesCulinary, galleriesSouvenir } = require("../services/galleries")

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

module.exports = { galleriesGtpController, galleriesFacilityController, galleriesCulinaryController, galleriesWorshipController
  , galleriesSouvenirController,  }