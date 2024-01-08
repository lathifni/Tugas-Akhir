const { listGeomSouvenir } = require("../services//souvenir")

const listGeomSouvenirController = async() => {
  return await listGeomSouvenir()
}

module.exports = { listGeomSouvenirController, }