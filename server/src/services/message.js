const promisePool = require("../../config/database")

const addMessage  = async(params) => {
  await promisePool.query(
    'INSERT INTO chat_message (chat_room_id, text, sender_id, is_read) VALUES (?, ?, ?, ?)',
    [params.chat_room_id, params.text, params.sender_id, params.is_read]
  );
  return params
}

const getMessages = async(params) => {
  // const [rows] = await promisePool.query(`SELECT * FROM message WHERE chat_id='${params.chat_id}' ORDER BY created_at ASC`)
  const [rows] = await promisePool.query(
    `SELECT * FROM chat_message WHERE chat_room_id='${params.chat_room_id}' ORDER BY created_at ASC`)
  return rows
}

const updateStatusRead = async(params) => {  
  const [rows] = await promisePool.query(
    `UPDATE chat_message SET is_read = ? WHERE chat_room_id = ?`, [1, params.chat_room_id])
  return rows
}

module.exports = { addMessage, getMessages, updateStatusRead, }