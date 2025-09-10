'use strict';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

const cors = require('cors');
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://d0tf10nc-3001.asse.devtunnels.ms',
  ],
};

const router = require('./src/routes/index');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 menit
  limit: 210,                 // 210 request per 15 menit per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'To much request from your IP address, please try again later',
});

var app = express();

// app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// ====== ROUTES KAMU ======
app.use('/users', router.users);
app.use('/oauth2', router.oauthGoogle);
app.use('/auth', router.auth);
app.use('/gtp', router.gtp);
app.use('/galleries', router.galeries);
app.use('/event', router.event);
app.use('/village', router.village);
app.use('/culinary', router.culinary);
app.use('/worship', router.worship);
app.use('/homestay', router.homestay);
app.use('/souvenir', router.souvenir);
app.use('/kotaKabKec', router.kotaKabKec);
app.use('/attraction', router.attraction);
app.use('/package', router.package);
app.use('/reservation', router.reservation);
app.use('/chat', router.chat);
app.use('/messages', router.messages);
app.use('/facility', router.facility);
app.use('/referral', router.referral);
app.use('/integration', router.integration);

// ====== MYSQL2 POOL ======
const mysql = require('mysql2');
const db = mysql.createPool({
  host             : process.env.DB_HOST,
  user             : process.env.DB_USER,
  password         : process.env.DB_PASSWORD,
  database         : process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit  : 10,
  queueLimit       : 0,
}).promise(); // supaya bisa pakai async/await

// ====== /db-check ala CodeIgniter ======
app.get('/db-check', async (req, res) => {
  try {
    const [[{ version }]] = await db.query('SELECT VERSION() AS version');
    const [[{ db: activeDb }]] = await db.query('SELECT DATABASE() AS db');

    const content = {
      Platform: 'MySQL (mysql2)',
      Version : version,
      Database: activeDb || process.env.DB_DATABASE || null,
    };

    return res.status(200).json({
      data: content,
      message: ['Successfully Connected to Database'],
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return res.status(500).json({
      data: null,
      status: 500,
      message: ['Failed to connect to the database'],
      error: error.message,
    });
  }
});

// ====== ERROR HANDLER ======
app.use(function (err, req, res, next) {
  // Kamu bisa bikin versi JSON juga kalau mau seragam
  const status = err.status || 500;
  if (req.headers['content-type'] === 'application/json') {
    return res.status(status).json({
      data: null,
      status,
      message: [err.message || 'Internal Server Error'],
    });
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status).end();
});

module.exports = app;
