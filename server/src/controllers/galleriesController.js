const { galleriesGtp, gallerieFacility } = require("../services/galleries")

const galleriesGtpController = async() => {
  return await galleriesGtp()
}

const galleriesFacilityController = async(params) => {
  return await gallerieFacility(params)
}

module.exports = { galleriesGtpController, galleriesFacilityController, }