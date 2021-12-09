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

const mapOfHashes = {};

io.on('connection', (socket) => {
  console.log('Terminal conectado');

  socket.on('disconnect', () => {
    console.log('Terminal desconectado');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    const hasUnresolvedHash = Object.keys(mapOfHashes).some((hash) => mapOfHashes[hash] === false);

    if (hasUnresolvedHash) {
      io.emit('chat message', 'Há processamento pendente no sistema!');
      return;
    }

    io.emit('chat message', msg);

    const payloads = String(msg).split(',');

    payloads.map((p) => {
      mapOfHashes[p] = false;
    });

    const callback = (data) => {
      console.log(`Enviando o resultado da mensagem: ${data.payload}`);
      mapOfHashes[data.payload] = true;
      io.emit('response', { ...data, sender: socket.id });
    };

    createWorkers({ payloads, callback });
  });
});

server.listen(3000, () => {
  console.log('Servidor inicializado na porta *:3000');
});
