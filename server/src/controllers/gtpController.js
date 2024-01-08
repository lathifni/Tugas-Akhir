const { getInfo, getGeom } = require("../services/gtp")

const getInfoController = async(payload) => {
  return getInfo()
}

const getGeomController = async() => {
  return await getGeom()
}

module.exports = { getInfoController, getGeomController, }