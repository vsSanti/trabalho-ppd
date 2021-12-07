const { Worker } = require('worker_threads');

const LEADING_ZEROES = 4;

const createWorkers = ({ payloads, callback }) => {
  for (let payload of payloads) {
    const worker = new Worker('./src/worker.js', { env: { LEADING_ZEROES } });
    worker.once('message', callback);
    worker.on('error', console.error);

    console.log(`Iniciando worker de ID ${worker.threadId} e enviando o payload "${payload}"`);
    worker.postMessage(payload);
  }
};

module.exports = { createWorkers };