const { getInfo, getGeom, getAllObject } = require("../services/gtp")

const getInfoController = async(payload) => {
  return getInfo()
}

const getGeomController = async() => {
  return await getGeom()
}

const getAllObjectController = async() => {
  return await getAllObject()
}

module.exports = { getInfoController, getGeomController, getAllObjectController, }