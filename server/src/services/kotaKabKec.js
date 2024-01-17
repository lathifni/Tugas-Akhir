const promisePool = require("../../config/database")

listGeomKotaKab = async() => {
  const [rows] = await promisePool.query('SELECT id, name, ST_AsGeoJSON(geom) AS geom FROM kab_kota')
  return rows
}

listGeomKec = async() => {
  const [rows] = await promisePool.query('SELECT id, name, ST_AsGeoJSON(geom) AS geom FROM kecamatan')
  return rows
}

module.exports ={ listGeomKec, listGeomKotaKab }