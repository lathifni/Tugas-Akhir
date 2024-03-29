const promisePool = require('../../config/database')

const getAllCostumer = async () => {
  // return [rows] = await promisePool.query(`SELECT U.* FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  // JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE AGU.group_id='2'`)
  const sql = `SELECT U.* FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE AGU.group_id='2'`
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
  const { email, fullname, user_image, google } = params
  const sql = `INSERT IGNORE INTO users (email,fullname,password_hash,user_image,google) VALUES ('${email}','${fullname}','0','${user_image}',${google})`
  const [rows] = await promisePool.query(sql)
  if (rows.affectedRows == 0) return false
  createAuthGroupsUser(rows.insertId)
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

const getUserByEmailAndGoogle = async (params) => {
  const sql = `SELECT U.id,U.google,U.user_image,AG.role FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE U.email='${params.email}' AND U.google=1 `
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
  const sql = `SELECT U.* FROM users AS U JOIN auth_groups_users AS AGU ON AGU.user_id=U.id 
  JOIN auth_groups AS AG ON AG.id=AGU.group_id WHERE AGU.group_id='1'`
  const [rows] = await promisePool.query(sql)
  return rows
}

module.exports = { 
getAllCostumer, createDataUser, checkAvailablelUsername, checkAvailableEmail, getUserByUsernameOrEmail, storeRefreshToken, checkUsesrByRefreshToken,
deleteRefreshToken, checkAvailableRefreshToken, getUserByEmailAndGoogle, checkAvailableEmailAndGoogle, createDataUserByGoogleOAuth, getAllAdminUser
}