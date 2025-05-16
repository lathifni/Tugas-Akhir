var express = require('express');
const { weatherForecastHandler, waterForecastHandler, weatherForecastByDateHandler, waterForecastByDateHandler } = require('../handlers/integrationHandler');

var router = express.Router();

router.get('/weather', weatherForecastHandler)
router.get('/water', waterForecastHandler);
router.get('/weather/:date_awal/:date_akhir', weatherForecastByDateHandler)
router.get('/water/:date_awal/:date_akhir', waterForecastByDateHandler)

module.exports = router;
