const promisePool = require('../../config/database')

const getListAllBasePackage = async() => {
  const [rows] = await promisePool.query("SELECT * FROM package WHERE custom=0")
  return rows
}

module.exports = { getListAllBasePackage, }