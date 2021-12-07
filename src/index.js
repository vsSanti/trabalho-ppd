const { createWorkers } = require('./createWorkers');

// deve receber como entrada de um socket
const payloads = require('./data/payloads.json');

// callback deve enviar de volta os dados processados pra quem chamou o socket
const callback = (data) => console.log(data);

// chama quando recebe uma mensagem do socket
createWorkers({ payloads, callback });
