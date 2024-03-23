const { userChats, findChat, createChat } = require("../services/chat")

const createChatController = async(params) => {
  return await createChat(params)
}

const userChatsController = async(params) => {
  return await userChats(params)
}

const findChatController = async(params) => {
  return await findChat(params)
}

module.exports = { createChatController, userChatsController, findChatController, }