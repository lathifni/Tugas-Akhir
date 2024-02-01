const promisePool = require("../../config/database");

const getListAllBasePackage = async () => {
  const [rows] = await promisePool.query(
    "SELECT P.*, PT.type_name FROM package as P JOIN package_type AS PT ON P.type_id = PT.id WHERE P.custom=0"
  );
  return rows;
};

const getPackageById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT P.name,P.min_capacity,P.contact_person,P.price,P.description,PT.type_name FROM package as P JOIN package_type AS PT ON P.type_id = PT.id WHERE P.id='${params.id}'`
  );
  return rows;
}

const getListAllServicePackageById = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT P.id, SP.*, DSP.* FROM package AS P JOIN detail_service_package AS DSP ON P.id = DSP.package_id 
    JOIN service_package AS SP ON DSP.service_package_id = SP.id WHERE P.id = '${params.id}'`
  );
  return rows;
};

const getAverageRatingPackageById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT ROUND(AVG(rating), 1)  AS average_rating FROM reservation
    WHERE package_id = '${params.id}' AND rating > 0;`
  );
  return rows; 
}

const getPackageActivityById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT DP.*, COALESCE(event.name, culinary_place.name, worship_place.name, attraction.name, facility.name, homestay.name, 'Unknown Activity') AS activity_name
  FROM detail_package AS DP
  LEFT JOIN event ON DP.activity_type = 'EV' AND DP.object_id = event.id
  LEFT JOIN culinary_place ON DP.activity_type = 'CP' AND DP.object_id = culinary_place.id
  LEFT JOIN worship_place ON DP.activity_type = 'WO' AND DP.object_id = worship_place.id
  LEFT JOIN attraction ON DP.activity_type = 'A' AND DP.object_id = attraction.id
  LEFT JOIN facility ON DP.activity_type = 'FC' AND DP.object_id = facility.id
  LEFT JOIN homestay ON DP.activity_type = 'HO' AND DP.object_id = homestay.id
  WHERE package_id = '${params.id}'
  `
  );
  return rows; 
}


module.exports = { getListAllBasePackage, getPackageById, getListAllServicePackageById, getAverageRatingPackageById, getPackageActivityById, };
