const promisePool = require('../../config/database')

const getAllCostumer = async () => {
  // const sql = `SELECT U.* FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  // JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE AGU.group_id='2'`
  const sql = `SELECT U.* FROM users U JOIN role R ON R.id=U.role_id WHERE R.id=2;`
  const [rows] = await promisePool.query(sql)
  return rows
}

const createDataUser = async (params) => {
  const { email, username, fullname, hashPassword, phone, address} = params
  const sql = `INSERT IGNORE INTO users (email,username,fullname,password_hash,phone,address) VALUES ('${email}','${username}','${fullname}','${hashPassword}','${phone}','${address}')`
  const [rows] = await promisePool.query(sql)
  if (rows.affectedRows == 0) return false
  createAuthGroupsUser(rows.insertId)
  return rows[0]
}

const createDataUserByGoogleOAuth = async (params) => {
  console.log(params, 'ini harusnya insert user yaah');
  
  const { email, fullname, user_image, google } = params
  const sql = `INSERT IGNORE INTO users (email,fullname,password_hash,user_image,google,role_id) VALUES ('${email}','${fullname}','0','${user_image}',${google},'2')`
  const [rows] = await promisePool.query(sql)
  if (rows.affectedRows == 0) return false
  // createAuthGroupsUser(rows.insertId)
  return true
}

const createAuthGroupsUser = async(params) => {
  await promisePool.query(`INSERT INTO auth_groups_users (group_id,user_id) VALUES (2,${params})`)
}

const checkAvailablelUsername = async (params) => {
  const sql = `SELECT username FROM users WHERE username='${params.username}'`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return true
  return false
}

const checkAvailableEmail = async (params) => {
  const sql = `SELECT email FROM users WHERE email='${params.email}' AND google=0`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return true
  return false
}

const checkAvailableEmailAndGoogle = async (params) => {
  const sql = `SELECT email FROM users WHERE email='${params.email}' AND google=1`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return true
  return false
}

const getUserByUsernameOrEmail = async (params) => {
  const sql = `SELECT U.id,fullname,email,password_hash,google,user_image,AG.role FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE (email='${params.emailOrUsername}' OR username='${params.emailOrUsername}') AND google=0`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return false
  return rows[0]
}

const searchUser = async(params) => {
  const sql = `SELECT * FROM users WHERE email='${params.emailOrUsername}' OR username='${params.emailOrUsername}';`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return false
  return rows[0]
}

const getUserByEmailAndGoogle = async (params) => {
  // const sql = `SELECT U.id,U.google,U.user_image,U.phone,AG.role FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  // JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE U.email='${params.email}' AND U.google=1 `
  const sql = `SELECT U.id,U.google,U.user_image,U.phone,AG.role FROM users U JOIN auth_groups AG ON AG.id=U.role_id 
  WHERE U.email='${params.email}' AND U.google=1`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return false
  return rows[0]
}

const storeRefreshToken = async (params) => {
  const sql = `UPDATE users SET refresh_token='${params.refreshToken}' WHERE email='${params.email}' AND google=${params.google}`
  await promisePool.query(sql)
}

const checkUsesrByRefreshToken = async (params) => {
  const sql = `SELECT id,email,google,user_image FROM users WHERE refresh_token='${params.refreshToken}'`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return false
  return rows[0]
}

const checkAvailableRefreshToken = async (params) => {
  const sql = `SELECT id FROM users WHERE refresh_token='${params.refreshToken}'`
  const [rows] = await promisePool.query(sql)
  if (rows[0] == undefined) return false
  return rows[0]
}

const deleteRefreshToken = async (params) => {
  const sql = `UPDATE users SET refresh_token=null WHERE id='${params.id}'`
  return [rows] = await promisePool.query(sql)
}

const getAllAdminUser = async () => {
  const sql = `SELECT U.* FROM users U JOIN role R ON R.id=U.role_id WHERE U.role_id='1'`
  const [rows] = await promisePool.query(sql)
  return rows
}

const detailById = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM users WHERE id=?`,
    [params.id]
  );
  return rows[0];
}

const updateUserInformation = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE users 
     SET fullname=?, address=?, phone=?
     WHERE id = ?`,
    [params.fullname, params.address, params.phone, params.id]
  );
  return rows.affectedRows;
}

const checkAvailableUsernameEmail = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM users WHERE email=? OR username=?`,
    [params.email, params.username]
  );
  return rows;
}

const addAdmin = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO users (email,username,fullname,role_id,password_hash) VALUES (?,?,?,?,?)`,
    [params.email, params.username,params.full_name, params.role_id,params.hashPassword]
  );
  return rows.affectedRows;
}

const deleteAdmin =  async(params) => {
  const [rows] = await promisePool.query(
    `DELETE FROM users WHERE id=?`,
    [params.id]
  );
  return rows.affectedRows;
}

const updateUserDetail = async(params) => {
  const [rows] = await promisePool.query(
    `UPDATE users SET address=?, phone=? WHERE email=?`,
    [params.address, params.phone, params.email]
  );
  return rows.affectedRows;
}

const allPhoneAdmin = async() => {
  const [rows] = await promisePool.query(
    `SELECT phone FROM users WHERE role_id=1`
  );
  return rows;
}

module.exports = { 
  getAllCostumer, createDataUser, checkAvailablelUsername, checkAvailableEmail, getUserByUsernameOrEmail
  , storeRefreshToken, checkUsesrByRefreshToken, deleteRefreshToken, checkAvailableRefreshToken
  , getUserByEmailAndGoogle, checkAvailableEmailAndGoogle, createDataUserByGoogleOAuth, getAllAdminUser
  , detailById, updateUserInformation, addAdmin, checkAvailableUsernameEmail, deleteAdmin
  , searchUser, updateUserDetail, allPhoneAdmin, 
}