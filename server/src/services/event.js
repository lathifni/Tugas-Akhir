const promisePool = require("../../config/database")

const listEvent = async() => {
  const [rows] = await promisePool.query('SELECT *, ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM event')
  return rows
}

module.exports = { listEvent, }