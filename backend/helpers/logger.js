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

function logger(message, level) {
    ensureLogDirExists();

    const stack = new Error().stack;
    const callerLine = stack.split('\n')[2];
    const match = callerLine.match(/\((.*):\d+:\d+\)/) || callerLine.match(/at (.*):\d+:\d+/);
    const callerFile = match ? match[1].split('/').slice(-1)[0] : 'unknown';

    const now = new Date();
    const logTime = now.toISOString().slice(0, 19).replace("T", " ");
    const formattedMessage = `[${logTime}][${level}][${callerFile}] - ${message}\n`;

    console.log(formattedMessage.trim());

    fs.appendFile(logFilePath, formattedMessage, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania logu do pliku:', err);
        }
    });
}

module.exports = logger;
