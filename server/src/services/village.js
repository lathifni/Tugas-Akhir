const promisePool = require("../../config/database")

const listVillage = async() => {
  const [rows] = await promisePool.query('SELECT id, name, ST_AsGeoJSON(geom) AS geom FROM village')
  return rows
}

module.exports = { listVillage, }