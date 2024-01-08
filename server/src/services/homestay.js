const promisePool = require("../../config/database")

const listGeomHomestay = async () => {
  const [rows] = await promisePool.query('SELECT id,name,address,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM homestay')
  return rows
}

module.exports = { listGeomHomestay, }