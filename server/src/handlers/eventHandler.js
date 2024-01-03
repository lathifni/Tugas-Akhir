const { listEventController } = require("../controllers/eventController");

const listEventHandler = async(req, res) => {
  try {
    const listEvent = await listEventController()

    return res.status(200).send({ status:'success', data:listEvent })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listEventHandler, }