const { createWorkers } = require('./createWorkers');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Terminal conectado');

  socket.on('disconnect', () => {
    console.log('Terminal desconectado');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    const payloads = String(msg).split(',');

    const callback = (data) => {
      io.emit('response', data);
    };

    createWorkers({ payloads, callback });
  });
});

server.listen(3000, () => {
  console.log('Servidor inicializado na porta *:3000');
});
