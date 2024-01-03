var express = require('express');
const { listEventHandler } = require('../handlers/eventHandler');

var router = express.Router();

router.get('/', listEventHandler)

module.exports = router;
