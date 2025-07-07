const fs = require('fs');
const path = require('path');

const logDir = '/log/url-shortener';
const logFileName = 'backend-log.txt';
const logFilePath = path.join(logDir, logFileName);

function ensureLogDirExists() {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

function getCallerFile() {
    const stack = new Error().stack;
    const callerLine = stack.split('\n')[3];
    const match = callerLine.match(/\((.*):\d+:\d+\)/) || callerLine.match(/at (.*):\d+:\d+/);
    return match ? match[1].split('/').slice(-1)[0] : 'unknown';
}

/**
 * Uproszczony logger
 * @param {string} level - poziom logu np. 'REQ', 'ERROR', 'INFO', 'DB' itd.
 * @param {string|object} arg1 - komunikat lub dane
 * @param {object} [arg2] - opcjonalne dane jeśli arg1 jest komunikatem
 */
function logger(level, arg1, arg2) {
    ensureLogDirExists();

    let message = '';
    let data = null;

    if (arg2 !== undefined) {
        // logger('ERROR', 'Błąd bazy', { errorCode: 'XYZ' })
        message = typeof arg1 === 'string' ? arg1 : JSON.stringify(arg1);
        data = arg2;
    } else {
        if (typeof arg1 === 'string') {
            // logger('INFO', 'Wiadomość')
            message = arg1;
        } else if (typeof arg1 === 'object' && arg1 !== null) {
            // logger('REQ', req.body)
            data = arg1;
        }
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        caller: getCallerFile(),
        message,
        data
    };

    console.log(JSON.stringify(logEntry, null, 2));
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', err => {
        if (err) {
            console.error('Błąd podczas zapisywania logu do pliku:', err);
        }
    });
}

module.exports = logger;
