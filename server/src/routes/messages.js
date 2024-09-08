var express = require('express');
const { getMessageHandler, addMessageHandler, updateStatusReadHandler } = require('../handlers/messagesHandler');

var router = express.Router();

router.post('/', addMessageHandler);
router.get('/:chat_room_id', getMessageHandler);
router.put('/read/:chat_room_id', updateStatusReadHandler)

module.exports = router;
