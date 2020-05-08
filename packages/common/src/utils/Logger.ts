enum LogLevel {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export default class Logger {
  public info = (message: any): void => {
    this.logWithLevel(LogLevel.Info, message);
  };

  public warn = (message: any): void => {
    this.logWithLevel(LogLevel.Warn, message);
  };

  public error = (message: any): void => {
    this.logWithLevel(LogLevel.Error, message);
  };

  private logWithLevel = (logLevel: LogLevel, message: any): void => {
    const logMessage = JSON.parse(JSON.stringify(message));

    // @ts-ignore
    console[logLevel.toString()](logMessage);
  };
}

const logger = new Logger();
export { logger as Logger };
