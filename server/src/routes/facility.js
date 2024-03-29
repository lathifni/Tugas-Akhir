var express = require('express');
const { getAllFacilityHandler } = require('../handlers/facilityHandler');

var router = express.Router();

router.get('/all', getAllFacilityHandler)

module.exports = router;
