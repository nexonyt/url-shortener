const amqp = require("amqplib");

let connection;
let channel;

async function initRabbit() {
    if (channel) return channel;

    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log("RabbitMQ connected ✔️");

    return channel;
}

module.exports = {
    initRabbit,
};
