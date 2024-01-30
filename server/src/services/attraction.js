const promisePool = require("../../config/database")

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

module.exports = { listGeomAttractions, estuaryGeomAttraction, makamGeomAttraction, tripGeomAttraction, trackingGeomAttraction, waterListGeomAttraction, cultureListGeomAttraction }