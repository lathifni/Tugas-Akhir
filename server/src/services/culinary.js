const promisePool = require("../../config/database")

const listGeomCulinary = async() => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM culinary_place')
  return rows
}

const listCulinaryByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,contact_person,open,close,capacity,description,status`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM culinary_place HAVING distance <= ${radius}`)
  return rows
}

const listAllCulinary = async() => {
  const [rows] = await promisePool.query('SELECT id,name FROM culinary_place')
  return rows
}

const getCulinaryById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT id,name,address,contact_person,open,close,capacity,description,status,ST_AsGeoJSON(geom) AS geom,
    ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM culinary_place WHERE id='${params.id}'`)
  return rows[0]
}

const getLatestIdCulinary = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM culinary_place`)
  return rows[0]
}

const addCulinary = async(params) => {
  // const sql = "INSERT INTO facility (id, name, type_id, geom, price, category) VALUES (?, ?, ?, ST_GeomFromText(?), ?, ?)";
  // const values = [params.id, params.name, params.type, params.geom, params.price, params.category];
  // const [rows] = await promisePool.query(sql, values);
  // return rows.affectedRows;
  const [rows] = await promisePool.query(
    `INSERT INTO culinary_place (id, name, address, contact_person, open, close, capacity, description, status, geom) 
    VALUES ('${params.id}', '${params.name}','${params.address}','${params.contact_person}','${params.open}'
    ,'${params.close}','${params.capacity}','${params.description}','${params.status}',ST_GeomFromText(${params.geom}))`
  );
  return rows.affectedRows;
}

const getLatestIdGalleryCulinary = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_culinary_place`)
  return rows[0]
}

const addCulinaryGallery = async(params) => {
  const sql = "INSERT INTO gallery_culinary_place (id, culinary_place_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.culinary_place_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const putCulinaryById = async(params) => {
  if (params.geom == null) {
    const [rows] = await promisePool.query(
      `UPDATE culinary_place SET name='${params.name}', address='${params.address}', description='${params.description}', contact_person='${params. contact_person}',
      open='${params.open}', close='${params.close}', capacity='${params.capacity}', status='${params.status}' WHERE id='${params.id}'`
    );
    return rows.affectedRows;
  }
  const [rows] = await promisePool.query(
    `UPDATE culinary_place SET name='${params.name}', address='${params.address}', geom=ST_GeomFromText(${params.geom}), description='${params.description}', 
    contact_person='${params. contact_person}', open='${params.open}', close='${params.close}', capacity='${params.capacity}', status='${params.status}' WHERE id='${params.id}'`
  );
  return rows.affectedRows;
}

const deleteCulinaryById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM culinary_place WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = { listGeomCulinary, listCulinaryByRadius, listAllCulinary, getCulinaryById, getLatestIdCulinary, addCulinary
  ,getLatestIdGalleryCulinary, addCulinaryGallery, putCulinaryById, deleteCulinaryById, 
 }