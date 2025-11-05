const { userChatsController, createChatController, findChatController, sendMessage, createRoomChatController, whatsAppClientController } = require("../controllers/chatController");
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
    const result = await whatsAppClientController()

    console.log(result);
    
    switch (result.status) {
      case "connected":
        return res.status(200).json({
          success: true,
          ...result,
        });

      case "waiting_for_qr":
        return res.status(202).json({ // Accepted - menunggu aksi user (scan QR)
          success: true,
          ...result,
        });

      case "initializing":
        return res.status(202).json({
          success: true,
          ...result,
        });

      case "error":
        return res.status(500).json({
          success: false,
          ...result,
        });

      default:
        return res.status(500).json({
          success: false,
          status: "unknown",
          message: "Terjadi kesalahan tidak diketahui",
        });
    }

    // res.status(200).json({ status: 'success', data: qrCode })
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