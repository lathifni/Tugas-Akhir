const promisePool = require("../../config/database")

const listGeomWorship = async() => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,capacity,status,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM worship_place')
  return rows
}

const listWorshipByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,status,capacity,status`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM worship_place HAVING distance <= ${radius}`)
  return rows
}

const listAllWorship = async() => {
  const [rows] = await promisePool.query('SELECT id,name FROM worship_place')
  return rows
}

module.exports = { listGeomWorship, listWorshipByRadius , listAllWorship, }