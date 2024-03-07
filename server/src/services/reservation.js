const promisePool = require("../../config/database");

const getListReservationByUserId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT P.name,R.id,R.request_date,R.check_in FROM reservation AS R JOIN package AS P ON R.package_id=P.id WHERE R.user_id=${params.id}`
  );
  return rows;
}

const getReservationById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT R.*,P.name,P.min_capacity,P.price,p.description,PT.type_name,MAX(CAST(PD.day AS UNSIGNED)) AS max_day FROM reservation AS R JOIN package AS P ON R.package_id=P.id 
    JOIN package_type AS PT ON PT.id=P.type_id JOIN package_day AS PD ON PD.package_id=R.package_id WHERE R.id='${params.id}'`
  );
  return rows;
}

const getServiceByReservationId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT SP.name,DSP.status FROM service_package AS SP JOIN detail_service_package AS DSP ON DSP.service_package_id=SP.id JOIN reservation AS R ON R.package_id=DSP.package_id WHERE R.id='${params.id}'`
  );
  return rows;
}

const getActivityByReservationId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT DP.day,DP.activity, COALESCE(event.name, culinary_place.name, worship_place.name, attraction.name, facility.name, homestay.name, 'Unknown Activity') AS activity_name
    FROM detail_package AS DP
          LEFT JOIN event ON DP.activity_type = 'EV' AND DP.object_id = event.id
          LEFT JOIN culinary_place ON DP.activity_type = 'CP' AND DP.object_id = culinary_place.id
          LEFT JOIN worship_place ON DP.activity_type = 'WO' AND DP.object_id = worship_place.id
          LEFT JOIN attraction ON DP.activity_type = 'A' AND DP.object_id = attraction.id
          LEFT JOIN facility ON DP.activity_type = 'FC' AND DP.object_id = facility.id
          LEFT JOIN homestay ON DP.activity_type = 'HO' AND DP.object_id = homestay.id
          JOIN reservation AS R ON R.package_id=DP.package_id WHERE R.id='${params.id}'`
  );
  return rows;
}

const getLatestIdReservation = async() => {
  const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) AS lastIdNumber FROM reservation`);
  return rows[0];
}

const createReservation = async(params) => {
  const {id,user_id,package_id,dp_id,request_date,token_midtrans,check_in,total_people,note,deposit,total_price,rating,status} = params
  const [rows] = await promisePool.query(`INSERT INTO reservation (id,user_id,package_id,dp_id,request_date,token_midtrans,check_in,total_people,note,deposit,total_price,rating,status)
  VALUES ('${id}','${user_id}','${package_id}','${dp_id}','${request_date}','${token_midtrans}','${check_in}','${total_people}','${note}','${deposit}','${total_price}','${rating}','${status}')`);
  return rows[0];
}

module.exports = { getListReservationByUserId, getReservationById, getServiceByReservationId, getActivityByReservationId, getLatestIdReservation,
createReservation, }