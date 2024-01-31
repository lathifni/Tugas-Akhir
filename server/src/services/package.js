const promisePool = require('../../config/database')

const getListAllBasePackage = async() => {
  const [rows] = await promisePool.query("SELECT P.*, PT.type_name FROM package as P JOIN package_type AS PT ON P.type_id = PT.id WHERE P.custom=0")
  return rows
}

module.exports = { getListAllBasePackage, }