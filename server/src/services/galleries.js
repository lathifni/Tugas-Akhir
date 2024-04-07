const promisePool = require("../../config/database")

const galleriesGtp = async() => {
  const [rows] = await promisePool.query('SELECT url FROM gallery_gtp')
  return rows
}

const gallerieFacility = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_facility WHERE facility_id='${params.id}'`)
  return rows
}

const deleteGalleriesFacilityById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE facility_id='${params.id}'`)
  return rows
}

const deleteGalleriesFacilityByUrl = async(params) => {
  console.log('ini di delete by url', params);
  const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE url='${params.url}'`)
  return rows
}

// const deleteGalleriesFacilityById = async(params) => {
//   const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE url='${params}'`)
//   return rows
// }

module.exports = { galleriesGtp, gallerieFacility, deleteGalleriesFacilityById, deleteGalleriesFacilityByUrl, }