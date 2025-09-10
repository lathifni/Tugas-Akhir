const promisePool = require("../../config/database")

const listAllAttractions = async() => {
  const [rows] = await promisePool.query(
    `(SELECT 
        id, 
        name, 
        type, 
        price,
        ST_Y(ST_Centroid(geom)) AS lat, 
        ST_X(ST_Centroid(geom)) AS lng 
    FROM attraction)
    
    UNION ALL
    
    (SELECT 
        id, 
        name, 
        'Culinary' AS type,      -- Kita tambahkan 'type' secara manual
        0 AS price,              -- Kita tambahkan 'price' secara manual
        ST_Y(ST_Centroid(geom)) AS lat, 
        ST_X(ST_Centroid(geom)) AS lng 
    FROM culinary_place)`
  )
  return rows
}

const listGeomAttractions = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction")
  return rows
}

const estuaryGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction WHERE id='A0004'")
  return rows
}

const makamGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction WHERE id='A0006'")
  return rows
}

const tripGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction WHERE id='A0005'")
  return rows
}

const trackingGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom_area) AS geom FROM attraction WHERE id='A0001'")
  return rows
}

const waterListGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction WHERE type='Water Attraction'")
  return rows
}

const cultureListGeomAttraction = async() => {
  const [rows] = await promisePool.query("SELECT id,name,type,price,description,video_url,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM attraction WHERE type='Culture'")
  return rows
}

const getAttractionById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT id,name,type,category,price,video_url,description,ST_AsGeoJSON(geom_area) AS geom,
    ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM attraction WHERE id='${params.id}'`)
  return rows[0]
}

const listAttractionByRadius = async(payload) => {  
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,price,type`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM attraction WHERE category=0 HAVING distance <= ${radius}`)
  return rows
}

const listUniqueAttractionByRadius = async(payload) => {  
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,price,type`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM attraction WHERE category=1 HAVING distance <= ${radius}`)
  return rows
}

module.exports = { listAllAttractions, listGeomAttractions, estuaryGeomAttraction, makamGeomAttraction, tripGeomAttraction, trackingGeomAttraction, waterListGeomAttraction
  , cultureListGeomAttraction, getAttractionById, listAttractionByRadius, listUniqueAttractionByRadius }