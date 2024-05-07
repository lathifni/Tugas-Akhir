var express = require('express');
const { userChatsHandler, whatsAppClientHandler, sendWhatsAppMessageHandler } = require('../handlers/chatHandler');

var router = express.Router();

router.post('/', );
router.get('/start', whatsAppClientHandler)
router.post('/sendMessage', sendWhatsAppMessageHandler)
router.get('/:user_id', userChatsHandler);
router.get('/find/:firstId/:secondId', );

module.exports = router;
