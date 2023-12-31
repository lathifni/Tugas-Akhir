const promisePool = require("../../config/database")

const getInfo = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM gtp`)
  return rows[0]
}

module.exports = { getInfo, }