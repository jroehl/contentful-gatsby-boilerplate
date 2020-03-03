const sanitizePath = path =>
  ['', ...path.split('/').filter(Boolean), ''].join('/');

class Logger {
  static log(...args) {
    console.log(...args);
  }
  static warn(...args) {
    console.warn(...args);
  }
  static info(...args) {
    console.info(...args);
  }
  static error(...args) {
    console.error(...args);
  }
}

module.exports = { Logger, sanitizePath };
