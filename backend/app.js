const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');
const tesseract = require('tesseract.js');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');    

const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', 'true' );
// mongoose.connect('mongodb://localhost:27017/ocr_application', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://darshana:software97@ocr-dgxlc.mongodb.net/ocr?retryWrites=true&w=majority', {useNewUrlParser: true});
const User = require('../models/user');
const Image = require('../models/img');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected dude!');
});

