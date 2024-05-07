const promisePool = require("../../config/database")

const createChat = async(params) => {
  const [rows] = await promisePool.query(`INSERT INTO chat (id,user_id) VALUES ('${params.id},'${params.user_id}')`)
  return rows
}

const userChats = async(params) => {
  const [rows] = await promisePool.query(`SELECT C.*,U.fullname,U.user_image FROM chat AS C JOIN users AS U ON U.id=C.user_id WHERE C.id='${params.user_id}'`)
  return rows
}

const findChat = async(params) => {
  const [rows] = await promisePool.query(`SELECT * FROM chat WHERE user_id='${params.user_id}'`)
  return rows
}

module.exports = { createChat, userChats, findChat }