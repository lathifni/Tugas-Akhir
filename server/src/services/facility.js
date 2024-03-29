const promisePool = require("../../config/database")

const allFacility = async() => {
  const [rows] = await promisePool.query('SELECT id, name FROM facility')
  return rows
}

module.exports = { allFacility }