const axios = require("axios");
const { initRabbit } = require("../configs/rabbitmq");

// ⬅️ Tu ustawiasz swój webhook
const NOTIFICATION_URL = "https://webhook.site/f1564b57-7855-46f7-9eb0-b5c7a1dcc528";

async function consumeQueue(queue) {
    const channel = await initRabbit();

    await channel.assertQueue(queue, { durable: true });
    console.log(`Consumer running for queue: ${queue}`);

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        let data;

        // 🚨 Walidacja JSON
        try {
            data = JSON.parse(msg.content.toString());
        } catch (err) {
            console.error(" [!] Invalid JSON:", msg.content.toString());
            channel.ack(msg);
            return;
        }

        console.log(" [>] Received message:", data);

        // 🔥 Wywołanie webhooka
        try {
            const response = await axios.post(NOTIFICATION_URL, data, {
                headers: { "Content-Type": "application/json" },
                timeout: 5000,
            });

            console.log(` [✓] Notification sent (${response.status}) → ${NOTIFICATION_URL}`);

            channel.ack(msg);
        } catch (err) {
            console.error(" [!] Notification error:", err.message);

            // Jeśli chcesz ponowić wiadomość, zmień na requeue: true
            channel.nack(msg, false, false);
        }
    });
}

module.exports = { consumeQueue };
