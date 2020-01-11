// const server = require('http');

// server.createServer((req,res)=>{
//     res.end('server is running');
// }).listen(4000);



// const server = require('http');
// const express = require('express');

// const app = express();

// app.use((req,res,next)=>{
//     res.send('this server is running');
// });

// server.createServer(app).listen(4000);


const server = require('http');

const app = require('./backend/app');
server.createServer(app).listen(4000);