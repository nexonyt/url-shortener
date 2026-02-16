const redisController = require("../services/redis/redisController");

async function generateConfirmationToken(linkId) {
    return `token-for-link-${linkId}`;
}

async function sendDeletionNotification(linkDetails) {
    try {
        const confirmation_token = generateConfirmationToken(linkDetails.link_id);
        const { sendToQueue } = require("../services/rabbitmq.producer");
        const notificationMessage = {
            type: "confirmation",
            link_id: linkDetails.link_id,
            alias: linkDetails.alias,
            timestamp: new Date().toISOString(),
            notification_url: linkDetails.notification_url,
            confirmation_token: confirmation_token
        };
        const queueName = "link_deletion_notifications";
        const redisKey = `${process.env.REDIS_PREFIX}LINK_DELETE_TOKEN_${link.short_link}`;
        const success = await redisController.set(redisKey, confirmation_token, 600);
        if (!success) {
            console.error("REDIS: An error occured!");
        }
        const isSent = await sendToQueue(queueName, notificationMessage);
        return isSent;
    } catch (err) {
        console.error("Error in sendDeletionNotification:", err);
        return false;
    }
}

module.exports = { sendDeletionNotification };