class ActionLogger {
    constructor(loggers = []) {
        this.loggers = loggers;
    }
    logAction(action) {
        this.loggers.forEach(logger => logger.log(action));
    }
}
const consoleLogger = {
    log: (action) => {
        console.log(`Action: ${action}`);
    }
};
class ArrayLogger {
    constructor() {
        this.logs = [];
    }
    getLogs() {
        return this.logs;
    }
    makeLogger() {
        return (action) => {
                this.logs.push(action);
            }
    }
}
const arrayLogger = new ArrayLogger();
logger = new ActionLogger([consoleLogger, arrayLogger.makeLogger()]);
