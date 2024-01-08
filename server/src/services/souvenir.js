const promisePool = require("../../config/database")

const listGeomSouvenir = async () => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM souvenir_place')
  return rows
}

module.exports = { listGeomSouvenir, }