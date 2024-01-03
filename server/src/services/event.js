const promisePool = require("../../config/database")

const listEvent = async() => {
  const [rows] = await promisePool.query('SELECT * FROM event')
  return rows
}

module.exports = { listEvent, }