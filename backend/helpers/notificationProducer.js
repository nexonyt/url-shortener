// helpers/producer.js
const amqp = require("amqplib");

async function sendToQueue(message) {
  const queue = "notifications";
  const connection = await amqp.connect("");
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(" [x] Sent to queue:", message);
  await channel.close();
  await connection.close();
}

module.exports = { sendToQueue };
