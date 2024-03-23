var express = require('express');
const { getMessageHandler, addMessageHandler } = require('../handlers/messagesHandler');

var router = express.Router();

router.post('/', addMessageHandler);
router.get('/:chat_id', getMessageHandler);

module.exports = router;
