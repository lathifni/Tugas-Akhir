const promisePool = require("../../config/database");

const getListReservationByUserId = async(params) => {
  console.log(params.id);
  const [rows] = await promisePool.query(
    `SELECT P.name,R.id,R.request_date,R.check_in FROM reservation AS R JOIN package AS P ON R.package_id=P.id WHERE R.user_id=${params.id}`
  );
  return rows;
}

module.exports = { getListReservationByUserId, }