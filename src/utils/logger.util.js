class Logger {
  constructor() {}

  info(msg) {
    console.log(msg);
  }

  warn(msg) {
    console.warn(msg);
  }

  error(msg) {
    console.error(msg);
  }
}

export const logger = new Logger();
