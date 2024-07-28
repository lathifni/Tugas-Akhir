const promisePool = require("../../config/database")

const listGeomSouvenir = async () => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM souvenir_place')
  return rows
}

const listSouvenirByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,status,contact_person`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM souvenir_place HAVING distance <= ${radius}`)
  return rows
}

const listAllSouvenir = async() => {
  const [rows] = await promisePool.query('SELECT id,name FROM souvenir_place')
  return rows
}

const getLatestIdSouvenir = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM souvenir_place`)
  return rows[0]
}

const addSouvenir = async(params) => {
  // const sql = "INSERT INTO facility (id, name, type_id, geom, price, category) VALUES (?, ?, ?, ST_GeomFromText(?), ?, ?)";
  // const values = [params.id, params.name, params.type, params.geom, params.price, params.category];
  // const [rows] = await promisePool.query(sql, values);
  // return rows.affectedRows;
  const [rows] = await promisePool.query(
    `INSERT INTO souvenir_place (id, name, address, contact_person, open, close, price, description, status, geom) 
    VALUES ('${params.id}', '${params.name}','${params.address}','${params.contact_person}','${params.open}'
    ,'${params.close}','${params.price}','${params.description}','${params.status}',ST_GeomFromText(${params.geom}))`
  );
  return rows.affectedRows;
}

const getSouvenirById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT id,name,address,contact_person,open,close,price,description,status,ST_AsGeoJSON(geom) AS geom FROM souvenir_place WHERE id='${params.id}'`)
  return rows[0]
}

const getLatestIdGallerySouvenir = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_souvenir_place`)
  return rows[0]
}

const addSouvenirGallery = async(params) => {
  const sql = "INSERT INTO gallery_souvenir_place (id, souvenir_place_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.souvenir_place_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const putSouvenirById = async(params) => {
  if (params.geom == null) {
    const [rows] = await promisePool.query(
      `UPDATE souvenir_place SET name='${params.name}', address='${params.address}', description='${params.description}', contact_person='${params. contact_person}',
      open='${params.open}', close='${params.close}', price='${params.price}', status='${params.status}' WHERE id='${params.id}'`
    );
    return rows.affectedRows;
  }
  const [rows] = await promisePool.query(
    `UPDATE souvenir_place SET name='${params.name}', address='${params.address}', geom=ST_GeomFromText(${params.geom}), description='${params.description}', 
    contact_person='${params. contact_person}', open='${params.open}', close='${params.close}', price='${params.price}', status='${params.status}' WHERE id='${params.id}'`
  );
  return rows.affectedRows;
}

const deleteSouvenirById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM souvenir_place WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = { listGeomSouvenir, listSouvenirByRadius, listAllSouvenir, getLatestIdSouvenir, addSouvenir, getLatestIdGallerySouvenir
  , addSouvenirGallery, putSouvenirById, getSouvenirById, deleteSouvenirById, }