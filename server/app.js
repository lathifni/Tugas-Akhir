var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Sesuaikan dengan kebutuhan Anda
};
const router = require('./src/routes/index')

var app = express();

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

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;