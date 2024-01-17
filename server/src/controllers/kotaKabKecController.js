const { listGeomKotaKab, listGeomKec } = require("../services/kotaKabKec")

const listGeomKotaKabController = async() => {
  return await listGeomKotaKab()
}

const listGeomKecController = async() => {
  return await listGeomKec()
}

module.exports ={ listGeomKotaKabController, listGeomKecController }