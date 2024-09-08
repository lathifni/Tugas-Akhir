const promisePool = require("../../config/database")

const listGeomWorship = async() => {
  const [rows] = await promisePool.query('SELECT id,name,address,status,capacity,status,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM worship_place')
  return rows
}

const listWorshipByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,status,capacity,status`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM worship_place HAVING distance <= ${radius}`)
  return rows
}

const listAllWorship = async() => {
  const [rows] = await promisePool.query('SELECT id,name FROM worship_place')
  return rows
}

const getWorshipById = async(params) => {
  const [rows] = await promisePool.query(`
    SELECT id,name,address,capacity,description,price,status,ST_AsGeoJSON(geom) AS geom,
    ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM worship_place WHERE id='${params.id}'`)
  return rows[0]
}

const addWorship = async(params) => {
  // const sql = "INSERT INTO facility (id, name, type_id, geom, price, category) VALUES (?, ?, ?, ST_GeomFromText(?), ?, ?)";
  // const values = [params.id, params.name, params.type, params.geom, params.price, params.category];
  // const [rows] = await promisePool.query(sql, values);
  // return rows.affectedRows;
  const [rows] = await promisePool.query(
    `INSERT INTO worship_place (id, name, address, capacity, description, status, price, geom) 
    VALUES ('${params.id}', '${params.name}','${params.address}','${params.capacity}','${params.description}','${params.status}'
    , '${params.price}', ST_GeomFromText(${params.geom}))`
  );
  return rows.affectedRows;
}

const getLatestIdWorship = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM worship_place`)
  return rows[0]
}

const getLatestIdGalleryWorship = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_worship_place`)
  return rows[0]
}

const addWorshipGallery = async(params) => {
  const sql = "INSERT INTO gallery_worship_place (id, worship_place_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.worship_place_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const putWorshipById = async(params) => {
  if (params.geom == null) {
    const [rows] = await promisePool.query(
      `UPDATE worship_place SET name='${params.name}', address='${params.address}', description='${params.description}'
      , capacity='${params.capacity}', price='${params.price}', status='${params.status}' WHERE id='${params.id}'`
    );
    return rows.affectedRows;
  }
  const [rows] = await promisePool.query(
    `UPDATE culinary_place SET name='${params.name}', address='${params.address}', geom=ST_GeomFromText(${params.geom}), description='${params.description}', 
    price='${params. price}', capacity='${params.capacity}', status='${params.status}' WHERE id='${params.id}'`
  );
  return rows.affectedRows;
}

const deleteWorshipById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM worship_place WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = { listGeomWorship, listWorshipByRadius , listAllWorship, getWorshipById, getLatestIdWorship, getLatestIdGalleryWorship
  , addWorship, addWorshipGallery, deleteWorshipById, putWorshipById,  }