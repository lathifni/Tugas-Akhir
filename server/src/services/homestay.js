const promisePool = require("../../config/database")

const listGeomHomestay = async () => {
  const [rows] = await promisePool.query('SELECT id,name,address,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM homestay')
  return rows
}

const listHomestayByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,contact_person`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM homestay HAVING distance <= ${radius}`)
  return rows
}

module.exports = { listGeomHomestay, listHomestayByRadius }