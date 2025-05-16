const promisePool = require("../../config/database");

const getListReservationByUserId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT P.name,R.id,R.request_date,R.check_in,RS.status FROM reservation R JOIN package P ON R.package_id=P.id 
    JOIN reservation_status RS ON RS.id=R.status_id WHERE R.user_id=${params.id}`
  );
  return rows;
}

const updateReservationStatusTimeout = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE reservation SET status_id = '7' WHERE user_id = ${params.id} AND (request_date < NOW() - INTERVAL 24 HOUR 
    OR deposit_date < NOW() - INTERVAL 24 HOUR) AND reservation.status_id IN (2, 3);`
  );
  return rows.affectedRows;
}

const homestayUnitByReservationId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT UH.*,H.name,H.address,HUT.name_type,DR.review,DR.rating,DR.reservation_id FROM detail_reservation DR JOIN unit_homestay UH ON UH.homestay_id=DR.homestay_id 
    AND UH.unit_type=DR.unit_type AND UH.unit_number=DR.unit_number JOIN homestay H ON H.id=DR.homestay_id JOIN homestay_unit_type HUT 
    ON HUT.id=DR.unit_type WHERE DR.reservation_id='${params.id}';`
  );
  return rows;
}

const updateManyReservationStatusTimeout = async() => {
  const [rows] = await promisePool.query(
    `UPDATE reservation SET status_id = '7' WHERE (request_date < NOW() - INTERVAL 24 HOUR 
    OR deposit_date < NOW() - INTERVAL 24 HOUR) AND reservation.status_id IN (2, 3);`
  );
  return rows.affectedRows;
}

const updatReservationConfirmationTimeout = async() => {
  const [rows] = await promisePool.query(
    `UPDATE reservation SET status_id = '9' WHERE request_date < NOW() - INTERVAL 12 HOUR AND reservation.status_id='1'
    AND confirmation_date IS NULL;`
  );
  return rows.affectedRows;
}

// const getReservationById = async(params) => {
//   const [rows] = await promisePool.query(
//     `SELECT R.*,RS.status,U.fullname,U.address,U.phone,RS.status,P.name,P.min_capacity,P.price,p.description,PT.type_name,MAX(CAST(PD.day AS UNSIGNED)) AS max_day
//     FROM reservation AS R 
//     JOIN package AS P ON R.package_id=P.id JOIN package_type AS PT ON PT.id=P.type_id JOIN package_day AS PD ON PD.package_id=R.package_id 
//     JOIN reservation_status AS RS ON RS.id=R.status_id JOIN users U ON U.id=R.user_id 
//     JOIN reservation_status AS RS ON RS.id=R.status_id WHERE R.id='${params.id}'`
//   );
//   return rows;
// }
const getReservationById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT R.*, RS.status, U.fullname, U.address, U.phone, P.name, P.min_capacity, P.price, P.description, PT.type_name, MAX(CAST(PD.day AS UNSIGNED)) AS max_day
    FROM reservation AS R 
    JOIN package AS P ON R.package_id = P.id 
    JOIN package_type AS PT ON PT.id = P.type_id 
    JOIN package_day AS PD ON PD.package_id = R.package_id 
    JOIN reservation_status AS RS ON RS.id = R.status_id 
    JOIN users AS U ON U.id = R.user_id 
    WHERE R.id = ?`,
    [params.id]
  );
  return rows;
}

const getServiceByReservationId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT SP.name,DSP.status FROM service_package AS SP JOIN detail_service_package AS DSP ON DSP.service_package_id=SP.id JOIN reservation AS R ON R.package_id=DSP.package_id 
    WHERE R.id='${params.id}'`
  );
  return rows;
}

const getActivityByReservationId = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT DP.day,DP.activity, COALESCE(event.name, culinary_place.name, worship_place.name, attraction.name, facility.name, homestay.name, 'Unknown Activity') AS activity_name
    FROM detail_package AS DP
          LEFT JOIN event ON DP.activity_type = 'EV' AND DP.object_id = event.id
          LEFT JOIN culinary_place ON DP.activity_type = 'CP' AND DP.object_id = culinary_place.id
          LEFT JOIN worship_place ON DP.activity_type = 'WP' AND DP.object_id = worship_place.id
          LEFT JOIN attraction ON DP.activity_type = 'A' AND DP.object_id = attraction.id
          LEFT JOIN facility ON DP.activity_type = 'FC' AND DP.object_id = facility.id
          LEFT JOIN homestay ON DP.activity_type = 'HO' AND DP.object_id = homestay.id
          JOIN reservation AS R ON R.package_id=DP.package_id WHERE R.id='${params.id}'`
  );
  return rows;
}

const getLatestIdReservation = async() => {
  // const [rows] = await promisePool.query(`SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) AS lastIdNumber FROM reservation`);
  const [rows] = await promisePool.query(`SELECT MAX(CAST(RIGHT(id, 4) AS UNSIGNED)) AS lastIdNumber FROM reservation WHERE id LIKE 'RTeestt%'`);
  return rows[0];
}

const createReservation = async(params) => {
  const {id,user_id,package_id,dp_id,request_date,check_in,total_people,note,deposit,total_price,idUserReferral} = params
  const ownerReferralValue = idUserReferral ? `'${idUserReferral}'` : `NULL`;
  const [rows] = await promisePool.query(`INSERT INTO reservation (id,user_id,package_id,dp_id,request_date,check_in,total_people,note,deposit,total_price,rating,status_id,owner_referral_id)
  VALUES ('${id}','${user_id}','${package_id}','${dp_id}','${request_date}','${check_in}','${total_people}','${note}','${deposit}','${total_price}','0','1',${ownerReferralValue})`);
  return rows.affectedRows;
}

const callbackRedirect = async(param) => {
  const [rows] = await promisePool.query(`SELECT id FROM reservation WHERE dp_id='${param.dp_id}'`);
  return rows[0];
}

const updateReservationInformation = async(params) => {
  const { id,paymentDate,token,status_id } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET deposit_date = '${paymentDate}', token_midtrans='${token}', status_id = '${status_id}' WHERE id = '${id}'`);
  return rows[0];
}

const updateAfterFullPaymentReservationInformation = async(params) => {
  const { id,paymentDate,token,status_id } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET payment_date = '${paymentDate}', token_midtrans='${token}', status_id = '${status_id}' WHERE id = '${id}'`);
  return rows[0];
}


const getReservationAfterDeposit = async(params) => {
  const [rows] = await promisePool.query(`SELECT R.id,R.total_price,R.deposit,U.fullname,U.email,P.id AS 'package_id',P.name,R.request_date,R.check_in 
    FROM reservation AS R JOIN users AS U ON U.id=R.user_id JOIN package AS P ON P.id=R.package_id WHERE R.id='${params}'`);
  return rows[0];
}

const allReservation = async() => {
  const [rows] = await promisePool.query(`SELECT R.id,R.request_date,R.check_in,P.name,RS.status,U.fullname FROM reservation AS R JOIN package AS P ON P.id=R.package_id 
  JOIN users AS U On U.id=R.user_id JOIN reservation_status AS RS ON RS.id=R.status_id ORDER BY R.check_in DESC`);
  return rows;
}

const getReservationAndUserById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT R.*,RS.status,U.email,COALESCE(NULLIF(U.fullname,''), U.username) AS user_name,P.name,P.min_capacity,P.price,p.description,PT.type_name,MAX(CAST(PD.day AS UNSIGNED)) 
    AS max_day FROM reservation AS R 
    JOIN package AS P ON R.package_id=P.id JOIN package_type AS PT ON PT.id=P.type_id JOIN package_day AS PD ON PD.package_id=R.package_id 
    JOIN reservation_status AS RS ON RS.id=R.status_id JOIN users AS U ON U.id=R.user_id WHERE R.id='${params.id}'`
  );
  return rows[0];
} 

const updateReservationConfirmation = async(params) => {
  const [rows] = await promisePool.query(`UPDATE reservation SET token_midtrans='${params.token_midtrans}',confirmation_date='${params.confirmation_date}',status_id='${params.status_id}' WHERE id ='${params.id}'`);
  return rows[0];
}

const newTotalByIdReservation = async(params) => {
  const [rows] = await promisePool.query(`UPDATE reservation SET deposit='${params.new_deposit}' WHERE id ='${params.id}'`);
  return rows[0];
}

const createReviewPackage = async(params) => {
  const { id, rating, review } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET rating='${rating}', review='${review}' WHERE id='${id}'`);  
  return rows.affectedRows;
}

const createReviewHomestay = async(params) => {
  const { rating, review, reservation_id, unit_number, unit_type } = params
  const [rows] = await promisePool.query(`UPDATE detail_reservation SET rating='${rating}', review='${review}' 
    WHERE reservation_id='${reservation_id}' AND unit_number='${unit_number}' AND unit_type='${unit_type}'`);  
  return rows.affectedRows;
}

const refund = async(params) => {  
  const { account_refund, cancel_date, refund_date,id,refund_amount } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET account_refund='${account_refund}', 
    cancel_date='${refund_date}',status_id='8', refund_amount=${refund_amount} WHERE id='${id}'`);
  return rows.affectedRows;
}

const cancel = async(params) => {
  const { cancel_date,id } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET cancel_date='${cancel_date}',status_id='6' WHERE id='${id}'`);
  return rows.affectedRows;
}

const refundAdminProof = async(params) => {
  const { proof_refund, admin_refund,refund_date, id } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET proof_refund='${proof_refund}', 
    admin_refund='${admin_refund}', refund_check = NULL, refund_date='${refund_date}' WHERE id='${id}'`);
  return rows.affectedRows;
}

const refundConfirmation = async(params) => {
  const { status, id, status_id } = params
  const [rows] = await promisePool.query(`UPDATE reservation SET refund_check='${status}', status_id='${status_id}' WHERE id='${id}'`);
  return rows.affectedRows;
}

const deleteDetailReservationById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM detail_reservation WHERE reservation_id ='${params.id}'`)
  return rows.affectedRows
}

const deleteReservationById = async(params) => {
  const [rows] = await promisePool.query(`Delete FROM reservation WHERE id ='${params.id}'`)
  return rows.affectedRows
}

module.exports = { getListReservationByUserId, getReservationById, getServiceByReservationId, getActivityByReservationId
  , getLatestIdReservation, createReservation, callbackRedirect, updateReservationInformation, updateAfterFullPaymentReservationInformation
  , getReservationAfterDeposit, allReservation, getReservationAndUserById, updateReservationConfirmation, newTotalByIdReservation
  , createReviewPackage, updateReservationStatusTimeout, updateManyReservationStatusTimeout, updatReservationConfirmationTimeout, refund
  , refundAdminProof, refundConfirmation, cancel, homestayUnitByReservationId, createReviewHomestay, deleteReservationById
  , deleteDetailReservationById, }