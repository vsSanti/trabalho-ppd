const { parentPort } = require('worker_threads');
const crypto = require('crypto');

parentPort.once('message', (message) => {
  console.log(`Recebeu mensagem: ${message}`);
  const payload = message;
  let nonce = 0;
  let generatedHash = '';

  const startDate = new Date().getTime();
  do {
    generatedHash = crypto.createHash('sha256').update(payload + nonce).digest('hex');
    nonce++;
  } while (generatedHash.slice(0, process.env.LEADING_ZEROES) !== '0'.repeat(process.env.LEADING_ZEROES));

  const endDate = new Date().getTime();
  const totalDuration = Math.abs(endDate - startDate)/1000;

  parentPort.postMessage({
    payload: message,
    nonce,
    hash: generatedHash,
    totalDuration
  });
})