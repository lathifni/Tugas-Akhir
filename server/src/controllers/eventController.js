const { listEvent } = require("../services/event")

const listEventController = async() => {
  return await listEvent()
}

module.exports = { listEventController, }