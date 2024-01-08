const promisePool = require("../../config/database")

const listGeomWorship = async() => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,capacity,status,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM worship_place')
  return rows
}

module.exports = { listGeomWorship, }