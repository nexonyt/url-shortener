const winston = require('winston');

// Tworzenie głównego loggera
const baseLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'orderAPI' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '/src/logs/src/logs/log.log' })
    ]
});

// Klasa opakowująca dla chainowania metod
class LoggerWrapper {
    constructor(logger, meta = {}) {
        this.logger = logger;
        this.meta = meta;
    }

    feature(value) {
        // Tworzenie nowej instancji z dodanym polem feature
        return new LoggerWrapper(this.logger, { ...this.meta, feature: value });
    }

    component(value) {
        // Tworzenie nowej instancji z dodanym polem component
        return new LoggerWrapper(this.logger, { ...this.meta, component: value });
    }

    log(level, message) {
        this.logger.log(level, message, this.meta);
    }

    error(message) {
        this.log('error', message);
    }

    warn(message) {
        this.log('warn', message);
    }

    info(message) {
        this.log('info', message);
    }

    debug(message) {
        this.log('debug', message);
    }
}

// Eksportowanie opakowanego loggera
module.exports = new LoggerWrapper(baseLogger);
