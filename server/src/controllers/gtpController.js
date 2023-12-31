const { getInfo } = require("../services/gtp")

const getInfoController = async(payload) => {
  return getInfo()
}

module.exports = { getInfoController, }