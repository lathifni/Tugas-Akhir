var express = require('express');
const { userChatsHandler } = require('../handlers/chatHandler');

var router = express.Router();

router.post('/', );
router.get('/:user_id', userChatsHandler);
router.get('/find/:firstId/:secondId', );

module.exports = router;
