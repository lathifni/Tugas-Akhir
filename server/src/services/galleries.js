const promisePool = require("../../config/database")

const galleriesGtp = async() => {
  const [rows] = await promisePool.query('SELECT url FROM gallery_gtp')
  return rows
}

module.exports = { galleriesGtp, }