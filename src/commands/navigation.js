// src/commands/navigation.js
const path = require('path');
const fs = require('fs/promises');

/**
 * Переход на один уровень вверх, если текущая папка не является корнем.
 */
async function up() {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);
  // Если родитель не отличается от текущего (либо мы в корне), ничего не делаем
  if (currentDir === parentDir || currentDir === path.parse(currentDir).root) {
    return;
  }
  process.chdir(parentDir);
}

/**
 * Переход в указанную директорию. Путь может быть абсолютным или относительным.
 * @param {string} dirPath 
 */
async function cd(dirPath) {
  if (!dirPath) {
    throw new Error('Invalid input');
  }
  const targetDir = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
  const stat = await fs.stat(targetDir);
  if (!stat.isDirectory()) {
    throw new Error('Path is not a directory');
  }
  process.chdir(targetDir);
}

/**
 * Вывод содержимого текущего каталога.
 * Сначала выводятся папки, затем файлы — оба списка сортируются по алфавиту.
 */
async function ls() {
  const currentDir = process.cwd();
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  
  directories.forEach((dir) => console.log(`${dir} - directory`));
  files.forEach((file) => console.log(`${file} - file`));
}

module.exports = { up, cd, ls };
