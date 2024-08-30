const promisePool = require("../../config/database")

const createChat = async(params) => {
  const [rows] = await promisePool.query(`INSERT INTO chat (id,user_id) VALUES ('${params.id},'${params.user_id}')`)
  return rows
}

const userChats = async(params) => {
  const [rows] = await promisePool.query(`SELECT C.*,U.fullname,U.user_image FROM chat AS C JOIN users AS U ON U.id=C.user_id WHERE C.id='${params.user_id}'`)
//   SELECT CR.id, U.fullname, U.user_image
// FROM chat_room CR
// JOIN member_chat_room MCR ON MCR.chat_room_id = CR.id
// JOIN users U ON U.id = MCR.user_id
// WHERE CR.id IN (
//     SELECT MCR1.chat_room_id
//     FROM member_chat_room MCR1
//     WHERE MCR1.user_id = 30
// )
// AND U.id != 30;
  return rows
}

const findChat = async(params) => {
  const [rows] = await promisePool.query(`SELECT * FROM chat WHERE user_id='${params.user_id}'`)
  return rows
}

module.exports = { createChat, userChats, findChat }