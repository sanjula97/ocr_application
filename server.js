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

const http = require('http');
const app = require('./backend/app');
const debug = require('debug');

const normalizePort = (val)=>{
    var PORT = parseInt(val, 10);
    if(isNaN(PORT)){
        return val;
    }

    if(PORT>=0){
        return PORT;
    }

    return false;
}

const onError = (error)=>{
    if(error.syscall!=="listen"){
        throw error;
    }

    const bind = typeof addr === "string" ? "pipe "
    + addr : "Port " + PORT;

    switch(error.code){
        case "EACCES":
            console.error(bind + " requires elevated privileges!");
            process.exit(1);

        case "EADDRINUSE":
            console.error(bind + " is already in use!");
            process.exit(1);
            
        default:
            throw error;

    }
}

const onListening = ()=>{
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr
    : "port " + PORT;
    debug("Listening on " + bind);
}

const PORT = normalizePort(process.env.PORT || "3000");

app.set('port', PORT);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

console.log('Server is running on localhost: ' + PORT);
server.listen(process.env.PORT || PORT);