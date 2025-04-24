const crypto = require('crypto');

// Функция, которая принимает входной поток и выводной поток,
// считывает данные, вычисляет хэш SHA256 и записывает его в выходной поток.
async function hashFromStream(inputStream, outputStream) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    inputStream.on('data', (chunk) => {
      hash.update(chunk);
    });
    inputStream.on('end', () => {
      const result = hash.digest('hex');
      outputStream.write(result + '\n', () => {
        resolve();
      });
    });
    inputStream.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { hashFromStream };
