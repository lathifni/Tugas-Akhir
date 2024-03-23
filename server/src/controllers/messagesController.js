const {nanoid} = require("nanoid");

const { getMessages, addMessage } = require("../services/message")

const addMessageController = async(params) => {
  const nanoId = nanoid(10); 
  const id = params.chat_id + nanoId
  params.id = id
  return await addMessage(params)
}

const getMessagesController = async(params) => {
  return await getMessages(params)
}

module.exports = { addMessageController, getMessagesController, }