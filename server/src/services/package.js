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
  const COALESCE_NAME = `COALESCE(event.name, culinary_place.name, worship_place.name, attraction.name, facility.name, homestay.name,souvenir_place.name, 'Unknown Activity') AS activity_name`;
  const COALESCE_PRICE =`COALESCE(event.price, worship_place.price, attraction.price, facility.price, 0) AS price`
  const COALESCE_CATEGORY = `COALESCE(event.category, attraction.category, facility.category, 'Shopping not include') AS category`
  const COALESCE_LAT = `COALESCE(ST_Y(ST_Centroid(event.geom)), ST_Y(ST_Centroid(culinary_place.geom)), ST_Y(ST_Centroid(worship_place.geom)), ST_Y(ST_Centroid(attraction.geom)), ST_Y(ST_Centroid(facility.geom)), ST_Y(ST_Centroid(homestay.geom)),ST_Y(ST_Centroid(souvenir_place.geom)), NULL) AS activity_lat`;
  const COALESCE_LNG = `COALESCE(ST_X(ST_Centroid(event.geom)), ST_X(ST_Centroid(culinary_place.geom)), ST_X(ST_Centroid(worship_place.geom)), ST_X(ST_Centroid(attraction.geom)), ST_X(ST_Centroid(facility.geom)), ST_X(ST_Centroid(homestay.geom)),ST_X(ST_Centroid(souvenir_place.geom)), NULL) AS activity_lng`;
  const [rows] = await promisePool.query(
    `SELECT DP.*, ${COALESCE_NAME}, ${COALESCE_PRICE}, ${COALESCE_CATEGORY} ,${COALESCE_LAT}, ${COALESCE_LNG} FROM detail_package AS DP
      LEFT JOIN event ON DP.activity_type = 'EV' AND DP.object_id = event.id
      LEFT JOIN culinary_place ON DP.activity_type = 'CP' AND DP.object_id = culinary_place.id
      LEFT JOIN worship_place ON DP.activity_type = 'WP' AND DP.object_id = worship_place.id
      LEFT JOIN attraction ON DP.activity_type = 'A' AND DP.object_id = attraction.id
      LEFT JOIN facility ON DP.activity_type = 'FC' AND DP.object_id = facility.id
      LEFT JOIN souvenir_place ON DP.activity_type = 'SP' AND DP.object_id = souvenir_place.id
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

const updatePackageDay = async(params) => {
  // await promisePool.query(
  //   `DELETE FROM package_day WHERE package_id=?`
  //   , [params.package_id]
  // );
  const [rows] = await promisePool.query(
    `INSERT INTO package_day (package_id, day, description) 
    VALUES (?, ?, ?)`, [params.package_id, params.day, params.description]
  );
  return rows;
}

const deleteActivitiesBeforeUpdate = async(params) => {
  await promisePool.query(
    `DELETE FROM detail_package WHERE package_id=?`
    , [params]
  );
  await promisePool.query(
    `DELETE FROM package_day WHERE package_id=?`
    , [params]
  );
  
  await promisePool.query(
    `DELETE FROM detail_service_package WHERE package_id=?`
    , [params]
  );
}

const createPackageActivites = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO detail_package (package_id,day,activity,activity_type,object_id,description) 
    VALUES ('${params.package_id}','${params.day}','${params.activity}','${params.activity_type}','${params.object_id}',"${params.description}")`
  );
  return rows;
}
const updatePackageActivites = async(params) => {
  // await promisePool.query(
  //   `DELETE FROM detail_package WHERE package_id=?`
  //   , [params.package_id]
  // );
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

const updatePackageService = async(params) => {
  // await promisePool.query(
  //   `DELETE FROM detail_service_package WHERE package_id=?`
  //   , [params.package_id]
  // );
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

const allPackageType = async() => {
  const [rows] = await promisePool.query(`SELECT * FROM package_type`)
  return rows
}

const createNewPackage = async(params) => {
  const [rows] = await promisePool.query(
      `INSERT INTO package (id,name,type_id,min_capacity,price,contact_person,description,custom,cover_url,video_url) 
      VALUES ('${params.id}','${params.name}','${params.type_id}','${params.min_capacity}','${params.price}',
      '${params.contact_person}',"${params.description}",'${params.custom}', '${params.cover_url}', '${params.video_url}')`
  );
  return rows;
}

const getLatestIdGalleryPackage = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) AS lastIdNumberGallery FROM gallery_package`)
  return rows[0]
}

const addPackageGallery = async(params) => {
  const sql = "INSERT INTO gallery_package (id, package_id, url) VALUES (?, ?, ?)";
  const values = [params.id, params.package_id, params.url];
  const [rows] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

const getInformationPackageInById = async (params) => {  
  const [rows] = await promisePool.query(
    `SELECT P.*, MAX(CAST(PD.day AS UNSIGNED)) AS max_day FROM package P JOIN package_day PD ON PD.package_id=P.id WHERE P.id='${params.id}'`
  );  
  return rows;
};

const getInformationPackageDayInById = async (params) => {  
  const [rows] = await promisePool.query(
    `SELECT * FROM package_day WHERE package_id='${params.id}'`
  );  
  return rows;
};

// const updatePackageInformationLama = async(params) => {
//   const [rows] = await promisePool.query(
//     `UPDATE package 
//     SET name = '${params.name}', type_id = '${params.type_id}', min_capacity = '${params.min_capacity}', 
//     price = '${params.price}', contact_person = '${params.contact_person}', description = "${params.description}", 
//     custom = '${params.custom}', cover_url = '${params.cover_url}', video_url = '${params.video_url}'
//     WHERE id = '${params.id}'`
//   );
//   return rows;
// }

const updatePackageInformation = async(params) => {
  let query = `UPDATE package SET name = '${params.name}', 
                type_id = '${params.type_id}', 
                min_capacity = '${params.min_capacity}', 
                price = '${params.price}', 
                contact_person = '${params.contact_person}', 
                description = "${params.description}"`;

  // Cek jika cover_url ada di params
  if (params.cover_url) {
    query += `, cover_url = '${params.cover_url}'`;
  }

  // Cek jika video_url ada di params
  if (params.video_url) {
    query += `, video_url = '${params.video_url}'`;
  }

  // Tambahkan klausa WHERE
  query += ` WHERE id = '${params.id}'`;

  // Jalankan query
  const [rows] = await promisePool.query(query);
  return rows;
}

const deletePackageDayById = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM package_day WHERE package_id=?`
    , [params.id]
  );
  return rows
}

const deleteDetailPackageById = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM detail_package WHERE package_id=?`
    , [params.id]
  );
  return rows
}

const deleteDetailServicePackageById = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM detail_service_package WHERE package_id=?`
    , [params.id]
  );
  return rows
}

const deleteGalleryPackageById = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM gallery_package WHERE package_id=?`
    , [params.id]
  );
  return rows
}

const deletePackageById = async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM package WHERE id=?`
    , [params.id]
  );
  return rows
}

const exploreOurPackage = async() => {
  const [rows] = await promisePool.query(
    `SELECT P.id,P.name,P.cover_url,DP.day,DP.activity,DP.activity_type,DP.object_id,DP.description FROM package P
    JOIN detail_package DP ON DP.package_id=P.id WHERE P.custom=0 ORDER BY P.id,DP.day,CAST(DP.activity AS UNSIGNED);`
  );
  return rows
}
const exploreBrowsePackage = async(params) => {
  console.log('ini idnya mah', params.id);
  
  const [rows] = await promisePool.query(
    `SELECT P.id, P.name, P.cover_url, DP.day, DP.activity, DP.activity_type, DP.object_id, DP.description FROM package P 
    JOIN detail_package DP ON DP.package_id = P.id WHERE P.custom = 0 AND P.id IN ( SELECT DISTINCT package_id FROM detail_package 
    WHERE object_id = '${params.id}' ) ORDER BY P.id, DP.day, CAST(DP.activity AS UNSIGNED);`
  );
  return rows  
}

const exploreMyPackage = async(params) => {
  console.log(params);
  
  const [rows] = await promisePool.query(
    `SELECT P.id,P.name,P.cover_url,DP.day,DP.activity,DP.activity_type,DP.object_id FROM package P JOIN detail_package DP ON DP.package_id=P.id 
    JOIN reservation R ON R.package_id=P.id WHERE R.user_id=${params.id} AND P.custom=0 ORDER BY P.id,DP.day,CAST(DP.activity AS UNSIGNED);`
  );
  return rows
}

const allActivityById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT P.id,P.name,P.cover_url,DP.day,DP.activity,DP.activity_type,DP.object_id FROM package P
    JOIN detail_package DP ON DP.package_id=P.id WHERE P.custom=0 AND P.id='${params.id}'
    ORDER BY P.id,DP.day,CAST(DP.activity AS UNSIGNED);`
  );
  return rows
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
  allPackageType,
  createNewPackage,
  getLatestIdGalleryPackage,
  addPackageGallery,
  getInformationPackageInById,
  getInformationPackageDayInById,
  updatePackageInformation,
  updatePackageDay,
  deleteActivitiesBeforeUpdate,
  updatePackageActivites,
  updatePackageService,
  deletePackageDayById,
  deleteDetailPackageById,
  deleteDetailServicePackageById,
  deleteGalleryPackageById,
  deletePackageById,
  exploreOurPackage,
  allActivityById,
  exploreMyPackage,
  exploreBrowsePackage,
};
