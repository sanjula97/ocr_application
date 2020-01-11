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

const checkAuth = require('../backend/middleware/user-auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/images', express.static(path.join('backend/images')));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Headers', true);
//     res.header('Access-Control-Allow-Credentials', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     next();
// });

// Multer config
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (!isValid) {
            error = 'INVALID FILE TYPE!';
        }

        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        let name = file.originalname.toLowerCase().split(' ').join('-');
        name = name.substring(0, name.indexOf('.'));
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

app.get("/api/user", (req, res, next) => {
    // console.log(req.query.user_name);
    let oUser;
    User.findOne({email: req.query.email}).then(user=>{
        if(!user){
            return res.json({message: 'AUTH FAILED!'});
        }
        oUser = user;
        return bcrypt.compare(req.query.password, user.password);
    }).then(res0=>{
        if(!res0){
            return res.json({message: 'AUTH FAILED!'});
        }
        const token = jwt.sign({email: req.query.email, user_id: oUser._id}, 'secret', {expiresIn: '1h'});
        res.json({token: token, id: oUser._id, expiresIn: 3600});
    });

    
});

app.post("/api/user", (req, res, next) => {
    User.findOne({ email: req.body.email }).then((ures) => {
        if (!ures) {
            return bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save().then(res0=>{
                    return res.status(201).json({
                        message: '201K SUCCESS!',
                        user: res0
                    });
                });
                // console.log(user);
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
        }
        res.status(403).json({ message: "ALREADY A USER EXIST!" });
    });
});

