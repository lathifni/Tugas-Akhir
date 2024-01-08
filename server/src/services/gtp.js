const promisePool = require("../../config/database")

const getInfo = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gtp`)
  return rows[0]
}

const getGeom = async() => {
  const [rows] = await promisePool.query(`SELECT ST_AsGeoJSON(geom) AS geom FROM gtp`)
  return rows
}

module.exports = { getInfo, getGeom, }