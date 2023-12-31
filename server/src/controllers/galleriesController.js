const { galleriesGtp } = require("../services/galleries")

const galleriesGtpController = async() => {
  return await galleriesGtp()
}

module.exports = { galleriesGtpController, }