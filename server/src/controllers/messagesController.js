const moment = require('moment');

const { getMessages, addMessage, updateStatusRead } = require("../services/message")

const addMessageController = async(params) => {
  const created_at = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  params.created_at = created_at
  return await addMessage(params)
}

const getMessagesController = async(params) => {
  return await getMessages(params)
}

const updateStatusReadController = async(params) => {
  return await updateStatusRead(params)
}

module.exports = { addMessageController, getMessagesController, updateStatusReadController, }