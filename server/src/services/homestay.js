const promisePool = require("../../config/database")

const listGeomHomestay = async () => {
  const [rows] = await promisePool.query('SELECT id,name,address,contact_person,ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng, ST_AsGeoJSON(geom) AS geom FROM homestay')
  return rows
}

const listHomestayByRadius = async(payload) => {
  let { lat, lng, radius } = payload
  radius = radius/1000
  const distance = `(6371 * acos(cos(radians(${lat})) * cos(radians(ST_Y(ST_CENTROID(geom)))) 
                  * cos(radians(ST_X(ST_CENTROID(geom))) - radians(${lng})) 
                  + sin(radians(${lat}))* sin(radians(ST_Y(ST_CENTROID(geom)))))) AS distance`
  const coords = `ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng`
  const columns = `id,name,address,contact_person`
  const [rows] = await promisePool.query(`SELECT ${columns}, ${coords}, ${distance} FROM homestay HAVING distance <= ${radius}`)
  return rows
}

const listAllHomestay = async() => {
  const [rows] = await promisePool.query('SELECT id,name FROM homestay')
  return rows
}

const availableHomestay = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT H.id,H.name,UH.unit_number,UH.unit_type,UH.nama_unit,UH.capacity,UH.price FROM unit_homestay AS UH JOIN homestay AS H ON H.id=UH.homestay_id
    LEFT JOIN detail_reservation AS DR ON DR.homestay_id=UH.homestay_id AND DR.unit_type=UH.unit_type AND DR.unit_number=UH.unit_number 
    AND DR.date BETWEEN '${params.checkin_date}' AND '${params.checkout_date}' WHERE DR.date IS NULL`)
  return rows
}

const bookingHomestay = async(params) => {
  const sql = "INSERT INTO detail_reservation (date,homestay_id,unit_type,unit_number,reservation_id,rating) VALUES (?,?,?,?,?,?)";
  const values = [params.date, params.homestay.id, params.homestay.unit_type, params.homestay.unit_number, params.id, 0];
  await promisePool.query(sql, values);
  // const [rows] = await promisePool.query(sql, values);
  // return rows.affectedRows;
}

const bookedHomestay = async(params) => {
  const [rows] = await promisePool.query(`
    SELECT DR.*,H.name,UH.nama_unit,UH.capacity,UH.price FROM detail_reservation AS DR JOIN homestay AS H ON H.id=DR.homestay_id 
    JOIN unit_homestay AS UH ON UH.homestay_id=DR.homestay_id AND UH.unit_type=DR.unit_type AND UH.unit_number=DR.unit_number 
    WHERE DR.reservation_id='${params.id}';`)
  return rows
}

// const listBookedHomestayByReservationId = async(params) => {
//   const [rows] = await promisePool.query(`
//     SELECT DR.*,H.name,UH.nama_unit,UH.capacity,UH.price FROM detail_reservation AS DR JOIN homestay AS H ON H.id=DR.homestay_id 
//     JOIN unit_homestay AS UH ON UH.homestay_id=DR.homestay_id AND UH.unit_type=DR.unit_type AND UH.unit_number=DR.unit_number 
//     WHERE DR.reservation_id='${params.id}';`)
//   return rows
// }

// SELECT H.name,UH.unit_number,UH.nama_unit,UH.capacity,UH.price FROM unit_homestay AS UH JOIN homestay AS H ON H.id=UH.homestay_id
// LEFT JOIN detail_reservation AS DR ON DR.homestay_id=UH.homestay_id AND DR.unit_type=UH.unit_type AND DR.unit_number=UH.unit_number AND DR.date BETWEEN '2023-11-12' AND '2023-11-12'
// WHERE DR.date IS NULL;

const getHomestayById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT id,name,address,contact_person,description,ST_AsGeoJSON(geom) AS geom,
    ST_Y(ST_Centroid(geom)) AS lat, ST_X(ST_Centroid(geom)) AS lng FROM homestay WHERE id='${params.id}'`)
  return rows[0]
}

const getLatestIdHomestay = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumber FROM homestay`)
  return rows[0]
}

const getLatestIdGalleryHomestay = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_homestay`)
  return rows[0]
}

const addHomestay = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO homestay (id, name, address, geom, contact_person, description) 
    VALUES ('${params.id}', '${params.homestay_name}','${params.address}',ST_GeomFromText(${params.geom}),'${params.contact_person}','${params. description}')`
  );
  return rows.affectedRows;
}

const addHomestayGallery = async(params) => {
  const sql = "INSERT INTO gallery_homestay (id, homestay_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.homestay_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const deleteHomestayById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM homestay WHERE id ='${params.id}'`)
  return rows.affectedRows
}

const deleteUnitHomestayById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM unit_homestay WHERE homestay_id ='${params.id}'`)
  return rows.affectedRows
}

const getListAllGalleryHomestayById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT url FROM gallery_homestay WHERE homestay_id='${params.id}'`
  );
  return rows;
};

const getListAllUnitHomestayById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM unit_homestay WHERE homestay_id='${params.id}'`
  );
  return rows;
};

const getListAllHomestayFacilityById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM facility_homestay FH JOIN facility_homestay_detail FHD ON FHD.facility_homestay_id=FH.id 
    WHERE homestay_id='${params.id}'`
  );
  return rows;
};

const getListAllHomestayUnitById = async (params) => {
  const [rows] = await promisePool.query(
  //   `SELECT UH.*,FUD.description fud_description,FU.* FROM unit_homestay UH LEFT JOIN facility_unit_detail FUD 
  //   ON FUD.unit_type=UH.unit_type AND FUD.unit_number=UH.unit_number LEFT JOIN facility_unit FU 
  //   ON FU.id=FUD.facility_unit_id WHERE UH.homestay_id='${params.id}'`
  // );
    `SELECT UH.*,FUD.description fud_description,FU.*,ROUND(COALESCE(AVG(DR.rating), 0), 1) AS avg_rating FROM unit_homestay UH 
    LEFT JOIN facility_unit_detail FUD ON FUD.unit_type=UH.unit_type AND FUD.unit_number=UH.unit_number 
    LEFT JOIN facility_unit FU ON FU.id=FUD.facility_unit_id
    LEFT JOIN detail_reservation DR ON UH.homestay_id=DR.homestay_id AND UH.unit_type=DR.unit_type AND UH.unit_number=DR.unit_number AND DR.rating > 0
    WHERE UH.homestay_id='${params.id}'
    GROUP BY UH.unit_type, UH.unit_number, FU.id, FUD.description`
  );
  return rows;
};

const getListAllUnitType = async () => {
  const [rows] = await promisePool.query(
    `SELECT * FROM homestay_unit_type`
  );
  return rows;
};

const getListAllGalleryUnitType = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM gallery_unit WHERE homestay_id='${params.id}'`
  );
  return rows;
};

const getListAllFacilityHomestay = async () => {
  const [rows] = await promisePool.query(
    `SELECT * FROM facility_homestay`
  );
  return rows;
};

const getListAllFacilityUnit = async () => {
  const [rows] = await promisePool.query(
    `SELECT * FROM facility_unit`
  );
  return rows;
};

const addFacilityHomestayById = async(params) => {
  const sql = "INSERT INTO facility_homestay_detail (homestay_id,facility_homestay_id,description) VALUES (?,?,?)";
  const values = [params.id, params.id_facility, params.description];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const deleteFacilityHomestayById = async(params) => {
  console.log(params);
  const [rows] = await promisePool.query(
    `Delete FROM facility_homestay_detail WHERE homestay_id ='${params.id}' AND facility_homestay_id='${params.facilityId}'`)
  return rows.affectedRows
}

const getLatestIdFacilityHomestay = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM facility_homestay`)
  return rows[0]
}

const createNewFacilityHomestay = async(params) => {
  const [existingRows] = await promisePool.query(
    `SELECT * FROM facility_homestay WHERE LOWER(name) = LOWER(?)`, [params.name]
  );
  if (existingRows.length > 0) {
    throw new Error('Facility name already exists');
  }

  const [rows] = await promisePool.query(
    `INSERT INTO facility_homestay (id,name) 
    VALUES (?,?)`, [params.id, params.name]
  );
  return rows;
}

const getLatestIdFacilityHomestayUnit = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM facility_unit`)
  return rows[0]
}

const createNewFacilityHomestayUnit = async(params) => {
  const [existingRows] = await promisePool.query(
    `SELECT * FROM facility_unit WHERE LOWER(name) = LOWER(?)`, [params.name]
  );
  if (existingRows.length > 0) {
    throw new Error('Facility name already exists');
  }

  const [rows] = await promisePool.query(
    `INSERT INTO facility_unit (id,name) 
    VALUES (?,?)`, [params.id, params.name]
  );
  return rows;
}

const addFacilityUnitById = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO facility_unit_detail (homestay_id,unit_type,unit_number,facility_unit_id,description) 
    VALUES (?,?,?,?,?)`,
    [params.idHomestay,params.unit_type,params.idUnitHomestay,params.idFacilityUnit,params.description]
  );
  return rows.affectedRows;
}

const getLatestIdUnit = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(unit_number AS UNSIGNED)) AS latestUnitNumber FROM unit_homestay`)
  return rows[0]
}

const addUnit = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO unit_homestay (homestay_id,nama_unit,unit_type,unit_number,price,description,capacity) 
    VALUES (?,?,?,?,?,?,?)`,
    [params.homestay_id,params.unit_name,params.type_unit,params.unit_number,params.price,params.description,params.capacity]
  );
  return rows.affectedRows;
}

const deleteFacilityUnitDetail = async(params) => {
  const [rows] = await promisePool.query(
    `Delete FROM facility_unit_detail WHERE homestay_id ='${params.id_homestay}' 
    AND unit_number='${params.unitNumber}' AND facility_unit_id='${params.facilityId}'`)
  return rows.affectedRows
}

const getLatestIdGalleryUnit = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_unit`)
  return rows[0]
}

const addGalleryUnit = async(params) => {
  const sql = "INSERT INTO gallery_unit (id, homestay_id,unit_type,unit_number, url) VALUES (?,?,?,?,?)";
  const values = [params.id, params.homestay_id,params.unit_type,params.unit_number, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const addGalleryHomestay = async(params) => {
  console.log(params);
  
  const sql = "INSERT INTO gallery_homestay (id, homestay_id, url) VALUES (?,?,?)";
  const values = [params.id, params.homestay_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const deleteFacilityUnitDetailHomestay = async(params) => {  
  const [rows] = await promisePool.query(
    `Delete FROM facility_unit_detail WHERE homestay_id ='${params.homestay_id}' 
    AND unit_number='${params.unit_number}'`)
  return rows.affectedRows
}

const deleteUnitHomestay = async(params) => {  
  const [rows] = await promisePool.query(
    `Delete FROM unit_homestay WHERE homestay_id ='${params.homestay_id}' 
    AND unit_number='${params.unit_number}'`)
  return rows.affectedRows
}

const updateUnit = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE unit_homestay 
     SET nama_unit = ?, unit_type = ?, price = ?, description = ?, capacity = ? 
     WHERE unit_number = ? AND homestay_id = ?`,
    [params.unit_name, params.type_unit, params.price, params.description,
      params.capacity, params.unit_number, params.homestay_id]
  );
  return rows.affectedRows;
}

const updateHomestay = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE homestay 
     SET name = ?, address = ?, contact_person = ?, description = ? 
     WHERE id = ?`,
    [params.homestay_name, params.address, params.contact_person, params.description
      ,params.homestay_id]
  );
  return rows.affectedRows;
}

const deleteGalleryUnit = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM gallery_unit WHERE homestay_id=? AND unit_number=? AND url=? `,
    [params.homestay_id, params.unit_number, params.url]
  );
  return rows.affectedRows;
}

const deleteGalleryHomestay = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM gallery_homestay WHERE homestay_id=? AND url=? `,
    [params.homestay_id, params.url]
  );
  return rows.affectedRows;
}

const allReviewHomestayById = async(params) => {  
  const [rows] = await promisePool.query(
    `SELECT DR.rating, DR.review,DR.unit_type,DR.unit_number, COALESCE(U.username, U.fullname) AS username_or_fullname 
    FROM reservation AS R JOIN users AS U ON R.user_id = U.id JOIN detail_reservation AS DR ON DR.reservation_id=R.id 
    WHERE DR.homestay_id = ? AND DR.rating > 0;`,
    [params.id]
  );
  return rows;
}

module.exports = { listGeomHomestay, listHomestayByRadius, listAllHomestay, availableHomestay, bookingHomestay
  , bookedHomestay, getHomestayById, getLatestIdHomestay, getLatestIdGalleryHomestay, addHomestay
  , addHomestayGallery, deleteHomestayById, getListAllGalleryHomestayById, getListAllUnitHomestayById
  , getListAllHomestayFacilityById, getListAllHomestayUnitById, getListAllUnitType, getListAllFacilityUnit
  , getListAllFacilityHomestay, addFacilityHomestayById, deleteFacilityHomestayById, getLatestIdFacilityHomestay
  , createNewFacilityHomestay, getLatestIdFacilityHomestayUnit, createNewFacilityHomestayUnit
  , addFacilityUnitById, addUnit, deleteFacilityUnitDetail, getLatestIdGalleryUnit, addGalleryUnit
  , getLatestIdUnit, deleteUnitHomestay, getListAllGalleryUnitType, updateUnit, deleteGalleryUnit
  , addGalleryHomestay, deleteGalleryHomestay, updateHomestay, allReviewHomestayById
  , deleteFacilityUnitDetailHomestay, deleteUnitHomestayById, 
 }