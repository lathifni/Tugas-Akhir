const promisePool = require("../../config/database");

const getListAllBasePackage = async () => {
  const [rows] = await promisePool.query(
    "SELECT P.*, PT.type_name FROM package as P JOIN package_type AS PT ON P.type_id = PT.id WHERE P.custom=0"
  );
  return rows;
};

const getPackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT P.name,P.type_id,P.min_capacity,P.contact_person,P.price,P.description,PT.type_name, MAX(CAST(PD.day AS UNSIGNED)) AS max_day  FROM package as P JOIN package_type AS PT ON P.type_id = PT.id 
    JOIN package_day AS PD ON P.id=PD.package_id WHERE P.id='${params.id}'`
  );
  return rows;
};

const getListAllServicePackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT P.id, SP.*, DSP.* FROM package AS P JOIN detail_service_package AS DSP ON P.id = DSP.package_id 
    JOIN service_package AS SP ON DSP.service_package_id = SP.id WHERE P.id = '${params.id}'`
  );
  return rows;
};

const getAverageRatingPackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT ROUND(AVG(rating), 1)  AS average_rating FROM reservation
    WHERE package_id = '${params.id}' AND rating > 0;`
  );
  return rows;
};

const getPackageActivityById = async (params) => {
  const COALESCE_NAME = `COALESCE(event.name, culinary_place.name, worship_place.name, attraction.name, facility.name, homestay.name, 'Unknown Activity') AS activity_name`;
  const COALESCE_PRICE =`COALESCE(event.price, worship_place.price, attraction.price, facility.price, 0) AS price`
  const COALESCE_CATEGORY = `COALESCE(event.category, attraction.category, facility.category, 'Shopping not include') AS category`
  const COALESCE_LAT = `COALESCE(ST_Y(ST_Centroid(event.geom)), ST_Y(ST_Centroid(culinary_place.geom)), ST_Y(ST_Centroid(worship_place.geom)), ST_Y(ST_Centroid(attraction.geom)), ST_Y(ST_Centroid(facility.geom)), ST_Y(ST_Centroid(homestay.geom)), NULL) AS activity_lat`;
  const COALESCE_LNG = `COALESCE(ST_X(ST_Centroid(event.geom)), ST_X(ST_Centroid(culinary_place.geom)), ST_X(ST_Centroid(worship_place.geom)), ST_X(ST_Centroid(attraction.geom)), ST_X(ST_Centroid(facility.geom)), ST_X(ST_Centroid(homestay.geom)), NULL) AS activity_lng`;
  const [rows] = await promisePool.query(
    `SELECT DP.*, ${COALESCE_NAME}, ${COALESCE_PRICE}, ${COALESCE_CATEGORY} ,${COALESCE_LAT}, ${COALESCE_LNG} FROM detail_package AS DP
      LEFT JOIN event ON DP.activity_type = 'EV' AND DP.object_id = event.id
      LEFT JOIN culinary_place ON DP.activity_type = 'CP' AND DP.object_id = culinary_place.id
      LEFT JOIN worship_place ON DP.activity_type = 'WO' AND DP.object_id = worship_place.id
      LEFT JOIN attraction ON DP.activity_type = 'A' AND DP.object_id = attraction.id
      LEFT JOIN facility ON DP.activity_type = 'FC' AND DP.object_id = facility.id
      LEFT JOIN homestay ON DP.activity_type = 'HO' AND DP.object_id = homestay.id WHERE package_id = '${params.id}'`
  );
  return rows;
};

const getListAllGalleryPackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT url FROM gallery_package WHERE package_id='${params.id}'`
  );
  return rows;
};

const getListAllReviewPackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT R.rating, R.review, COALESCE(U.username, U.fullname) AS username_or_fullname FROM 
    reservation AS R JOIN users AS U ON R.user_id = U.id WHERE R.package_id = '${params.id}' AND R.rating > 0`
  );
  return rows;
};

const getListDayPackageById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM package_day WHERE package_id='${params.id}'`
  );
  return rows;
}

const getListAllServicePackage = async() => {
  const [rows] = await promisePool.query(
    `SELECT * FROM service_package`
  );
  return rows;
}

const getLatestIdPackage = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) AS lastIdNumber FROM package`);
  return rows[0];
}

const createExtendBooking = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO package (id,name,type_id,min_capacity,price,contact_person,description,custom) 
    VALUES ('${params.id}','${params.name}','${params.type_id}','${params.min_capacity}','${params.price}','${params.contact_person}',"${params.description}",'${params.custom}')`
  );
  return rows;
}

const createPackageDay = async(params) => {
  console.log(params);
  const [rows] = await promisePool.query(
    `INSERT INTO package_day (package_id,day,description) 
    VALUES ('${params.package_id}','${params.day}',"${params.description}")`
  );
  return rows;
}

const createPackageActivites = async(params) => {
  console.log(params);
  const [rows] = await promisePool.query(
    `INSERT INTO detail_package (package_id,day,activity,activity_type,object_id,description) 
    VALUES ('${params.package_id}','${params.day}','${params.activity}','${params.activity_type}','${params.object_id}',"${params.description}")`
  );
  return rows;
}

const createPackageService = async(params) => {
  console.log(params);
  const [rows] = await promisePool.query(
    `INSERT INTO detail_service_package (package_id,service_package_id,status) 
    VALUES ('${params.package_id}','${params.service_package_id}',"${params.status}")`
  );
  return rows;
}

const listAllPackage = async() => {
  const [rows] = await promisePool.query(`SELECT id,name FROM package WHERE custom = '0'`)
  return rows
}

const listAllServicePackage = async() => {
  const [rows] = await promisePool.query(`SELECT id,name FROM service_package`)
  return rows
}

const serviceById = async(params) => {
  const [rows] = await promisePool.query(`SELECT * FROM service_package WHERE id='${params.id}'`)
  return rows[0]
}

const getLatestIdService = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) AS lastIdNumber FROM service_package;`)
  return rows[0]
}

const addService = async(params) => {
  const sql = "INSERT INTO service_package (id, name, price, category) VALUES (?, ?, ?, ?)";
  const values = [params.id, params.name, params.price, params.category];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const deleteService = async(params) => {
  // const sql = `Delete FROM service_package WHERE id =${params}`
  // const values = [params.id, params.name, params.price, params.category];
  const [rows] = await promisePool.query(`Delete FROM service_package WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = {
  getListAllBasePackage,
  getPackageById,
  getListAllServicePackageById,
  getAverageRatingPackageById,
  getPackageActivityById,
  getListAllGalleryPackageById,
  getListAllReviewPackageById,
  getListDayPackageById,
  getListAllServicePackage,
  getLatestIdPackage,
  createExtendBooking,
  createPackageDay,
  createPackageActivites,
  createPackageService,
  listAllPackage,
  listAllServicePackage,
  serviceById,
  getLatestIdService,
  addService,
  deleteService,
};
