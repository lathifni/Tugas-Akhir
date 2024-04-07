const promisePool = require("../../config/database")

const allFacility = async() => {
  const [rows] = await promisePool.query('SELECT id, name FROM facility')
  return rows
}

const allTypeFacility = async() => {
  const [rows] = await promisePool.query('SELECT * FROM facility_type')
  return rows
}

const getLatestIdFacility = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM facility`)
  return rows[0]
}

const addFacility = async(params) => {
  // const sql = "INSERT INTO facility (id, name, type_id, geom, price, category) VALUES (?, ?, ?, ST_GeomFromText(?), ?, ?)";
  // const values = [params.id, params.name, params.type, params.geom, params.price, params.category];
  // const [rows] = await promisePool.query(sql, values);
  // return rows.affectedRows;
  const [rows] = await promisePool.query(
    `INSERT INTO facility (id, name, type_id, geom, price, category) VALUES ('${params.id}', '${params.name}','${params.type}',ST_GeomFromText(${params.geom}),'${params.price}','${params. category}')`
  );
  return rows.affectedRows;
}

const getLatestIdGalleryFacility = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_facility`)
  return rows[0]
}

const addFacilityGallery = async(params) => {
  const sql = "INSERT INTO gallery_facility (id, facility_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.facility_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const getFacilityById = async(params) => {
  const [rows] = await promisePool.query(`SELECT id,name,type_id,price,category,ST_AsGeoJSON(geom) AS geom FROM facility WHERE id='${params.id}'`)
  return rows[0]
}

const putFacilityById = async(params) => {
  if (params.geom == null) {
    const [rows] = await promisePool.query(
      `UPDATE facility SET name='${params.name}', type_id='${params.type}', price='${params.price}', category='${params. category}' WHERE id='${params.id}'`
    );
    return rows.affectedRows;
  }
  const [rows] = await promisePool.query(
    `UPDATE facility SET name='${params.name}', type_id='${params.type}', geom=ST_GeomFromText(${params.geom}), price='${params.price}', category='${params. category}' WHERE id='${params.id}'`
  );
  return rows.affectedRows;
}

const deleteFacilityById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM facility WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = { allFacility, allTypeFacility, getLatestIdFacility, addFacility, getLatestIdGalleryFacility, addFacilityGallery, getFacilityById, putFacilityById, deleteFacilityById, }