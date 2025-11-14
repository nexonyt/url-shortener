const { initRabbit } = require("../configs/rabbitmq");

async function sendToQueue(queue, message) {
    const channel = await initRabbit();

    // Upewniamy się, że kolejka istnieje
    await channel.assertQueue(queue, { durable: true });

    // Konwersja wiadomości do JSON
    const payload = Buffer.from(JSON.stringify(message));

    // Wysyłka
    const ok = channel.sendToQueue(queue, payload, { persistent: true });

    if (ok) {
        console.log(` [→] Message sent to queue "${queue}":`, message);
    } else {
        console.error(` [!] Failed to send message to queue "${queue}"`);
    }

    return ok;
}

module.exports = { sendToQueue };
