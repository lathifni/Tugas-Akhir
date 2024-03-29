const promisePool = require("../../config/database")

const getInfo = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gtp`)
  return rows[0]
}

const getGeom = async() => {
  const [rows] = await promisePool.query(`SELECT ST_AsGeoJSON(geom) AS geom FROM gtp`)
  return rows
}

const getAllObject = async() => {
  const [rows] = await promisePool.query(`
  SELECT id, name, category, 'E' AS type, price FROM event UNION SELECT id, name, 'shopping not include' as category, 'CP' AS type, 0 AS price FROM culinary_place UNION 
  SELECT id, name, 'shopping not include' as category, 'WP' AS type, 0 AS price FROM worship_place UNION SELECT id, name, category, 'A' AS type, price FROM attraction UNION 
  SELECT id,name,'shopping not include' as category, 'SP' AS type, 0 AS price FROM souvenir_place UNION SELECT id,name,category, 'F' AS type, price FROM facility`)
  return rows
}

const getFacilty = async() => {
  
}

module.exports = { getInfo, getGeom, getAllObject }