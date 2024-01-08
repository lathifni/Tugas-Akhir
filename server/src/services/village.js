const promisePool = require("../../config/database")

const listVillage = async() => {
  const [rows] = await promisePool.query('SELECT id, name, ST_AsGeoJSON(geom) AS geom FROM village')
  return rows
}

const getUlakanVillage = async() => {
  const [rows] = await promisePool.query(`SELECT name, ST_AsGeoJSON(geom) AS geom FROM village WHERE name='Ulakan'`)
  return rows
}

module.exports = { listVillage, getUlakanVillage, }