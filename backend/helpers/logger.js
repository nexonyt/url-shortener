const fs = require('fs');
const path = require('path');

function logger(message) {
    const now = new Date();
    const logTime = now.toISOString().slice(0, 19).replace("T", " ");
    const formattedMessage = `[${logTime}] - ${message}\n`;

    const logFileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-logs.txt`;
    const logFilePath = path.join(__dirname, logFileName);

    console.log(formattedMessage.trim());

    fs.appendFile(logFilePath, formattedMessage, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania logu do pliku:', err);
        }
    });
}

module.exports = { logger };
