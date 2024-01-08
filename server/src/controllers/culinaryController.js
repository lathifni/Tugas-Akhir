const { listGeomCulinary } = require("../services/culinary")

const listGeomCulinaryController = async() => {
  return await listGeomCulinary()
}

module.exports = { listGeomCulinaryController, }