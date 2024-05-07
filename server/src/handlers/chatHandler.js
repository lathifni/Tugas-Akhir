const { userChatsController, createChatController, findChatController, whatsAppClientController, sendMessage } = require("../controllers/chatController");

const createChatHandler = async(req, res) => {
  try {
    const createChat = await createChatController(req.body)

    res.status(200).json({ status: 'success', })
  } catch (error) {
    console.log(error);
  }
}

const userChatsHandler = async(req, res) => {
  try {
    const chats = await userChatsController(req.params)
    res.status(200).json({ status: 'success', data: chats })
  } catch (error) {
    console.log(error);
  }
}

const findChatHandler = async(req, res) => {
  try {
    const chat = await findChatController(req.params)

    res.status(200).json({ status: 'success', data: chat })
  } catch (error) {
    console.log(error);
  }
}

const whatsAppClientHandler = async(req, res) => {
  try {
    await whatsAppClientController()

    // console.log(qr);

    // res.send()
    res.status(200).json({ status: 'success', informasi: 'testttt' })
  } catch (error) {
    console.log(error);
  }
}

const sendWhatsAppMessageHandler = async (req, res) => {
  try {
    await sendMessage(req.body)

    res.status(200).json({ status: 'success', informasi: 'testttt' })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createChatHandler, userChatsHandler, findChatHandler, whatsAppClientHandler, sendWhatsAppMessageHandler, }