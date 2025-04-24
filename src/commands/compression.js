// src/commands/compression.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

/**
 * Сжимает файл с использованием Brotli.
 * @param {string} sourceFile - путь к исходному файлу
 * @param {string} destPath - путь, куда будет записан сжатый файл
 */
async function compress(sourceFile, destPath) {
  if (!sourceFile || !destPath) {
    throw new Error('Invalid input');
  }
  const sourcePath = path.isAbsolute(sourceFile) 
    ? sourceFile 
    : path.join(process.cwd(), sourceFile);
  const destinationPath = path.isAbsolute(destPath)
    ? destPath 
    : path.join(process.cwd(), destPath);
  
  await pipeline(
    fs.createReadStream(sourcePath),
    zlib.createBrotliCompress(),
    fs.createWriteStream(destinationPath)
  );
}

/**
 * Распаковывает файл, сжатый Brotli, обратно в исходное содержимое.
 * @param {string} sourceFile - путь к сжатому файлу
 * @param {string} destPath - путь, куда будет записан распакованный файл
 */
async function decompress(sourceFile, destPath) {
  if (!sourceFile || !destPath) {
    throw new Error('Invalid input');
  }
  const sourcePath = path.isAbsolute(sourceFile) 
    ? sourceFile 
    : path.join(process.cwd(), sourceFile);
  const destinationPath = path.isAbsolute(destPath)
    ? destPath 
    : path.join(process.cwd(), destPath);
    
  await pipeline(
    fs.createReadStream(sourcePath),
    zlib.createBrotliDecompress(),
    fs.createWriteStream(destinationPath)
  );
}

module.exports = { compress, decompress };
