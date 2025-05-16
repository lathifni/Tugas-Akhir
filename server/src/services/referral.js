const promisePool = require("../../config/database")

const listAllReferral  = async() => {
  const [rows] = await promisePool.query(
    `SELECT U.id, U.fullname, ROUND((R.total_price * U.percentage_referral / 100), 2) AS amount
    , R.referral_check, R.id id_reservation FROM users U JOIN reservation R ON R.owner_referral_id = U.id WHERE R.payment_date IS NOT NULL`,
  );
  return rows;
}

const listAllReferralByUserId  = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT U.fullname, ROUND((R.total_price * U.percentage_referral / 100), 2) AS amount , R.referral_check, R.id id_reservation
    FROM reservation R JOIN users U ON R.user_id = U.id WHERE R.payment_date IS NOT NULL AND R.owner_referral_id=?`,
    [params.user_id]
  );
  return rows;
}

const referralById = async(params) => {  
  const [rows] = await promisePool.query(
    `SELECT U.id, U.fullname, U.phone, U.code_referral,U.percentage_referral, U.account_referral
    ,ROUND((R.total_price * U.percentage_referral / 100), 2) AS amount, R.referral_check, R.id id_reservation
    ,P.name, R.total_price, R.referral_process_date, R.referral_proof, R.referral_check FROM users U JOIN reservation R ON R.owner_referral_id = U.id JOIN package P
    ON P.id = R.package_id WHERE R.id =?`,
    [params.id]
  );
  return rows[0];
}

const myReferralById = async(params) => {  
  const [rows] = await promisePool.query(
    `SELECT R.id, U.fullname, P.name, R.request_date, ROUND((R.total_price * U.percentage_referral / 100), 2) AS amount,
    R.referral_process_date, R.referral_proof, R.referral_check FROM reservation R JOIN users U ON U.id=R.user_id
    JOIN package P ON P.id=R.package_id WHERE R.id =?`,
    [params.id]
  );
  return rows[0];
}

const addReferralProof = async(params) => {  
  const [rows] = await promisePool.query(
    `UPDATE reservation SET referral_proof=?, referral_check = NULL WHERE id=?`,
    [params.referral_proof,params.id_reservation]
  );
  return rows.affectedRows;
}

const confirmationReferralProof = async(params) => {   
  const [rows] = await promisePool.query(
    `UPDATE reservation SET referral_check=?, referral_process_date=? WHERE id=?`,
    [params.status,params.referral_process_date,params.id]
  );  
  return rows.affectedRows;
}

const verifyCodeReferral = async(params) => {
  const [rows] = await promisePool.query(`SELECT id FROM users WHERE code_referral='${params.code_referral}'`);
  return rows[0];
}

const checkCodeReferralAfterDP = async(params) => {
  const { id } = params
  const [rows] = await promisePool.query(`SELECT U.code_referral,U.id FROM reservation R JOIN users U ON U.id=R.user_id WHERE R.id='${id}';`);
  return rows[0];
}

const makeNewCodeReferralAfterDP = async(params) => {
  const { id } = params
  const [rows] = await promisePool.query(`UPDATE users SET code_referral='gtp${id}', percentage_referral=7 WHERE id='${id}'`);
  return rows.affectedRows;
}

const createCodeReferral = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE users SET code_referral=?, percentage_referral=? WHERE id=?`,
    [`gtp${params.id}`,params.percentage_referral,params.id]
  );
  return rows.affectedRows;
}

module.exports = {
  listAllReferral, referralById, addReferralProof, verifyCodeReferral, checkCodeReferralAfterDP, makeNewCodeReferralAfterDP
  , createCodeReferral, listAllReferralByUserId, myReferralById, confirmationReferralProof, 
}