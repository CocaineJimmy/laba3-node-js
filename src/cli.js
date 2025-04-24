
const { Command } = require('commander');
const fs = require('fs');
const fsp = require('fs/promises');
const { pipeline } = require('stream/promises');
const { hashFromStream } = require('./cliTasks'); // пример задачи: hash
const { Readable } = require('stream');
const readline = require('readline');

const program = new Command();

program
  .requiredOption('-t, --task <task>', 'задача для выполнения')
  .option('-i, --input <input>', 'входной файл')
  .option('-o, --output <output>', 'выходной файл');

program.parse(process.argv);
const options = program.opts();

// Функция для создания входного потока
async function getInputStream() {
  if (options.input) {
    try {
      await fsp.access(options.input);
      const stat = await fsp.stat(options.input);
      if (stat.isDirectory()) throw new Error('Input is a directory');
      return fs.createReadStream(options.input);
    } catch (error) {
      console.error('Input file error:', error.message);
      process.exit(1);
    }
  } else {
    return process.stdin;
  }
}

// Функция для создания выходного потока. Если вход не задан (интерактивный режим),
// открываем поток с флагом "a" (append), чтобы результаты накапливались.
async function getOutputStream() {
  if (options.output) {
    try {
      const flags = options.input ? 'w' : 'a';
      return fs.createWriteStream(options.output, { flags });
    } catch (error) {
      console.error('Output file error:', error.message);
      process.exit(1);
    }
  } else {
    return process.stdout;
  }
}

// Функция обработки задачи
async function runTask() {
  const task = options.task;
  if (options.input) {
    // Если задан входной файл – выполняем задачу сразу на его содержимом
    const inputStream = await getInputStream();
    const outputStream = await getOutputStream();
    switch (task) {
      case 'hash':
        await hashFromStream(inputStream, outputStream);
        break;
      // можно добавить другие case для других задач
      default:
        console.error('Unknown task');
        process.exit(1);
    }
  } else {
    // Если входной файл не задан – запускаем интерактивный режим, читаем по строкам
    const rlInteractive = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
    rlInteractive.setPrompt('Enter input: ');
    rlInteractive.prompt();
    rlInteractive.on('line', async (line) => {
      // Создаем поток из введённой строки
      const lineStream = Readable.from([line]);
      const outputStream = await getOutputStream();
      switch (task) {
        case 'hash':
          await hashFromStream(lineStream, outputStream);
          break;
        // дополнительные задачи могут быть добавлены здесь
        default:
          console.error('Unknown task');
          process.exit(1);
      }
      rlInteractive.prompt();
    });
  }
}

runTask();
