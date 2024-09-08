const { getMessagesController, addMessageController, updateStatusReadController } = require("../controllers/messagesController");

const addMessageHandler = async(req, res) => {
  try {
    const message = await addMessageController(req.body)
    console.log(message);
    

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

const updateStatusReadHandler = async(req, res) => {
  try {
    await updateStatusReadController(req.params)

    res.status(200).json({ status: 'success' })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { addMessageHandler, getMessageHandler, updateStatusReadHandler}