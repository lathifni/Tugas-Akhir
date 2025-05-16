const { userChatsController, createChatController, findChatController, sendMessage, createRoomChatController, whatsAppClientControllerTestBaru } = require("../controllers/chatController");
const { addNewChatWithAdmin } = require("../services/chat");

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
    // const qrCode = await whatsAppClientControllerLamaaa()
    // const qrCode = await whatsAppClientController()
    // const qrCode = await whatsAppClientControllerTestBaru()
    const qrCode = await whatsAppClientControllerTestBaru()

    // console.log(qr);

    // res.send()
    res.status(200).json({ status: 'success', data: qrCode })
  } catch (error) {
    console.log(error);
  }
}

const sendWhatsAppMessageHandler = async (req, res) => {
  console.log('di sendMessage');
  
  try {
    console.log('di dalam trynya send wa msg');
    
    await sendMessage(req.body)

    res.status(200).json({ status: 'success', informasi: 'testttt' })
  } catch (error) {
    console.log(error);
  }
}

const addNewChatWithAdminHandler = async (req, res) => {
  try {
    const data = await addNewChatWithAdmin(req.params)

    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

const createRoomChatHandler = async (req, res) => {
  try {
    const data = await createRoomChatController(req.body)

    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createChatHandler, userChatsHandler, findChatHandler, whatsAppClientHandler, sendWhatsAppMessageHandler
  , addNewChatWithAdminHandler, createRoomChatHandler}