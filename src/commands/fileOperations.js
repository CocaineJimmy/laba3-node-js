// src/commands/fileOperations.js
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');

/**
 * Читает содержимое файла и выводит его в консоль с помощью Readable stream.
 * @param {string} filePath 
 */
async function cat(filePath) {
  if (!filePath) {
    throw new Error('Invalid input');
  }
  const fullPath = path.isAbsolute(filePath) 
    ? filePath 
    : path.join(process.cwd(), filePath);
  await pipeline(
    fs.createReadStream(fullPath, { encoding: 'utf8' }),
    process.stdout
  );
  // Печатаем перевод строки после вывода содержимого
  process.stdout.write('\n');
}

/**
 * Создает пустой файл с указанным именем в текущем рабочем каталоге.
 * @param {string} newFileName 
 */
async function add(newFileName) {
  if (!newFileName) {
    throw new Error('Invalid input');
  }
  const fullPath = path.join(process.cwd(), newFileName);
  // Флаг 'wx' завершает операцию, если файл уже есть
  await fsp.writeFile(fullPath, '', { flag: 'wx' });
}

/**
 * Переименовывает файл. Содержимое остается неизменным.
 * @param {string} sourceFile - путь к исходному файлу
 * @param {string} newFilename - новое имя файла (без изменения папки)
 */
async function rn(sourceFile, newFilename) {
  if (!sourceFile || !newFilename) {
    throw new Error('Invalid input');
  }
  const sourcePath = path.isAbsolute(sourceFile) 
    ? sourceFile 
    : path.join(process.cwd(), sourceFile);
  const dir = path.dirname(sourcePath);
  const targetPath = path.join(dir, newFilename);
  await fsp.rename(sourcePath, targetPath);
}

/**
 * Копирует файл с использованием потоков (pipeline).
 * @param {string} sourceFile - путь к исходному файлу
 * @param {string} destDir - путь к директории назначения
 */
async function cp(sourceFile, destDir) {
  if (!sourceFile || !destDir) {
    throw new Error('Invalid input');
  }
  const sourcePath = path.isAbsolute(sourceFile)
    ? sourceFile
    : path.join(process.cwd(), sourceFile);
  const destinationDir = path.isAbsolute(destDir)
    ? destDir
    : path.join(process.cwd(), destDir);
  
  // Проверим, что destDir существует и является директорией
  const stat = await fsp.stat(destinationDir);
  if (!stat.isDirectory()) {
    throw new Error('Destination is not a directory');
  }
  
  const targetPath = path.join(destinationDir, path.basename(sourcePath));
  await pipeline(
    fs.createReadStream(sourcePath),
    fs.createWriteStream(targetPath)
  );
}

/**
 * Перемещает файл: сначала копирует его, а затем удаляет исходный файл.
 * @param {string} sourceFile 
 * @param {string} destDir 
 */
async function mv(sourceFile, destDir) {
  await cp(sourceFile, destDir);
  const sourcePath = path.isAbsolute(sourceFile)
    ? sourceFile
    : path.join(process.cwd(), sourceFile);
  await fsp.unlink(sourcePath);
}

/**
 * Удаляет файл.
 * @param {string} filePath 
 */
async function rm(filePath) {
  if (!filePath) {
    throw new Error('Invalid input');
  }
  const fullPath = path.isAbsolute(filePath) ?
    filePath : path.join(process.cwd(), filePath);
  await fsp.unlink(fullPath);
}

module.exports = { cat, add, rn, cp, mv, rm };
