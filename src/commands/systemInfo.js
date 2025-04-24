// src/commands/systemInfo.js
const os = require('os');

/**
 * Вывод EOL в формате JSON (чтобы были видны спецсимволы).
 */
function eol() {
  console.log(JSON.stringify(os.EOL));
}

/**
 * Вывод информации о процессорах: общее количество,
 * модель и тактовая частота для каждого (в ГГц).
 */
function cpus() {
  const cores = os.cpus();
  console.log(`Total cores: ${cores.length}`);
  cores.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}: ${cpu.model}, ${(cpu.speed / 1000).toFixed(2)} GHz`);
  });
}

/**
 * Вывод домашнего каталога.
 */
function homedir() {
  console.log(os.homedir());
}

/**
 * Вывод системного имени пользователя.
 */
function username() {
  console.log(os.userInfo().username);
}

/**
 * Вывод архитектуры ЦП.
 */
function architecture() {
  console.log(process.arch);
}

module.exports = { eol, cpus, homedir, username, architecture };
