const promisePool = require("../../config/database")

const listGeomCulinary = async() => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM culinary_place')
  return rows
}

const listCulinaryByRadius = async() => {
  return 
}

module.exports = { listGeomCulinary, listCulinaryByRadius }