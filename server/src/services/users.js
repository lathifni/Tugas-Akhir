const promisePool = require('../../config/database')

const getDataUsers = async () => {
  return [rows] = await promisePool.query('SELECT * FROM users')
}

const createDataUser = async (params) => {
  const { email, username, fullname, hashPassword } = params
  const sql = `INSERT IGNORE INTO users (email,username,fullname,password_hash) VALUES ('${email}','${username}','${fullname}','${hashPassword}')`
  const [rows] = await promisePool.query(sql)
  if (rows.affectedRows == 0) return false
  return true
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

const getUserByUsernameOrEmail = async (params) => {
  const sql = `SELECT id,email,password_hash,google,user_image FROM users WHERE (email='${params.emailOrUsername}' OR username='${params.emailOrUsername}') AND google=0`
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

module.exports = { 
getDataUsers, createDataUser, checkAvailablelUsername, checkAvailableEmail, getUserByUsernameOrEmail, storeRefreshToken, checkUsesrByRefreshToken,
deleteRefreshToken, checkAvailableRefreshToken
}