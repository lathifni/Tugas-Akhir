const promisePool = require("../../config/database")

const galleriesGtp = async() => {
  const [rows] = await promisePool.query('SELECT url FROM gallery_gtp')
  return rows
}

const galleriesFacility = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_facility WHERE facility_id='${params.id}'`)
  return rows
}

const galleriesCulinary = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_culinary_place WHERE culinary_place_id='${params.id}'`)
  return rows
}

const galleriesWorship = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_worship_place WHERE worship_place_id='${params.id}'`)
  return rows
}

const galleriesSouvenir = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_souvenir_place WHERE souvenir_place_id='${params.id}'`)
  return rows
}

const galleriesAttraction = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_attraction WHERE attraction_id='${params.id}'`)
  return rows
}

const galleriesHomestay = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_homestay WHERE homestay_id='${params.id}'`)
  return rows
}

const galleriesHomestayUnit = async(params) => {
  const [rows] = await promisePool.query(`SELECT url FROM gallery_unit WHERE homestay_id='${params.id}'`)
  return rows
}

const deleteGalleriesFacilityById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE facility_id='${params.id}'`)
  return rows
}

const deleteGalleriesFacilityByUrl = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE url='${params.url}'`)
  return rows
}

const deleteGalleriesCulinaryByUrl = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_culinary_place WHERE url='${params.url}'`)
  return rows
}

const deleteGalleriesCulinaryById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_culinary_place WHERE culinary_place_id='${params.id}'`)
  return rows
}

const deleteGalleriesWorshipById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_worship_place WHERE worship_place_id='${params.id}'`)
  return rows
}

const deleteGalleriesWorshipByUrl = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_worship_place WHERE url='${params.url}'`)
  return rows
}

const deleteGalleriesSouvenirByUrl = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_souvenir_place WHERE url='${params.url}'`)
  return rows
}

const deleteGalleriesSouvenirById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_souvenir_place WHERE souvenir_place_id='${params.id}'`)
  return rows
}

const deleteGalleriesHomestayById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_homestay WHERE homestay_id='${params.id}'`)
  return rows
}

const deleteGalleriesUnitHomestayById = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_unit WHERE homestay_id='${params.id}'`)
  return rows
}

const deleteGalleriesUnit = async(params) => {
  const [rows] = await promisePool.query(`DELETE FROM gallery_unit 
    WHERE homestay_id='${params.homestay_id}' AND unit_number='${params.unit_number}'`)
  return rows
}

// const deleteGalleriesFacilityById = async(params) => {
//   const [rows] = await promisePool.query(`DELETE FROM gallery_facility WHERE url='${params}'`)
//   return rows
// }

module.exports = { galleriesGtp, galleriesFacility, galleriesCulinary, galleriesWorship, deleteGalleriesFacilityById, deleteGalleriesFacilityByUrl
  ,deleteGalleriesCulinaryByUrl, deleteGalleriesCulinaryById, deleteGalleriesWorshipById, deleteGalleriesWorshipByUrl, deleteGalleriesSouvenirByUrl
  , deleteGalleriesSouvenirById, galleriesSouvenir, deleteGalleriesHomestayById, deleteGalleriesUnit
  , galleriesAttraction, galleriesHomestay, galleriesHomestayUnit, deleteGalleriesUnitHomestayById, }