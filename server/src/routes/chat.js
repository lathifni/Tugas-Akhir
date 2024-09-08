var express = require('express');
const { userChatsHandler, whatsAppClientHandler, sendWhatsAppMessageHandler, addNewChatWithAdminHandler, createRoomChatHandler } = require('../handlers/chatHandler');

var router = express.Router();

router.post('/', );
router.get('/start', whatsAppClientHandler)
router.post('/sendMessage', sendWhatsAppMessageHandler)
router.get('/:user_id', userChatsHandler);
router.get('/find/:firstId/:secondId', );
router.get('/add-new-chat-with-admin/:user_id', addNewChatWithAdminHandler)
router.post('/create-room-chat', createRoomChatHandler)

module.exports = router;
