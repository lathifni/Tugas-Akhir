const promisePool = require("../../config/database")

const addMessage  = async(params) => {
  const { id, chat_id, sender_id, text, created_at } = params;

  await promisePool.query(
    'INSERT INTO message (id,chat_id, sender_id, text, created_at) VALUES (?, ?, ?, ?, ?)',
    [id,chat_id, sender_id, text, created_at]
  );
  return params
}

const getMessages  = async(params) => {
  const [rows] = await promisePool.query(`SELECT * FROM message WHERE chat_id='${params.chat_id}' ORDER BY created_at ASC`)
  return rows
}

module.exports = { addMessage, getMessages, }