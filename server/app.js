var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://8lcx6qm9-3001.asse.devtunnels.ms', 'https://8lcx6qm9-3000.asse.devtunnels.ms'], // Sesuaikan dengan kebutuhan Anda
};
const router = require('./src/routes/index')
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 210, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: 'To much request from your IP address, please try again later'
	// store: ... , // Use an external store for consistency across multiple server instances.
})

var app = express();

// app.use(limiter)
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))

app.use('/users', router.users);
app.use('/oauth2', router.oauthGoogle)
app.use('/auth', router.auth)
app.use('/gtp', router.gtp)
app.use('/galleries', router.galeries)
app.use('/event', router.event)
app.use('/village', router.village)
app.use('/culinary', router.culinary)
app.use('/worship', router.worship)
app.use('/homestay', router.homestay)
app.use('/souvenir', router.souvenir)
app.use('/kotaKabKec', router.kotaKabKec)
app.use('/attraction', router.attraction)
app.use('/package', router.package)
app.use('/reservation', router.reservation)

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;