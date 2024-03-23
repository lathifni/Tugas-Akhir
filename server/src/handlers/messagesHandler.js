const { getMessagesController, addMessageController } = require("../controllers/messagesController");

const addMessageHandler = async(req, res) => {
  try {
    const message = await addMessageController(req.body)

    res.status(200).json({ status: 'success', data: message })
  } catch (error) {
    console.log(error);
  }
}

const getMessageHandler = async(req, res) => {
  try {
    const messages = await getMessagesController(req.params)

    res.status(200).json({ status: 'success', data: messages })
  } catch (error) {
    console.log(error);
  }
}


module.exports = { addMessageHandler, getMessageHandler, }