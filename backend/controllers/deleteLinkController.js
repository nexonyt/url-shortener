const { validateToken } = require("../middlewares/authorization");

async function deleteLinkRequest(req, res) {
    try {
        const isAuthorized = await validateToken(req);
        if (!isAuthorized) {
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        const isLinkOwner = true; //TO DO
        if (!isLinkOwner) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }
        const linkDetails = {
            link_id: 123,
            alias: "example",
            extended_link: "https://example.com",
            notification_url: "https://example.com/notify"
        }
        const isNotificationSend = await sendDeletionNotification(linkDetails);
        if (isNotificationSend) {
            return res.status(202).json({error: false, message: "Deletion request accepted. Notification sended for confirmation."});
    }
    else {
        return res.status(500).json({error: true, message: "Failed to send deletion notification."});
    }
}
catch (err) {
    console.error("Error in deleteLinkRequest:", err);
    return res.status(500).json({error: true, message: "Internal Server Error"});
}
}

async function deleteLinkConfirmation(req, res) {
    try {
        const isAuthorized = await validateToken(req);
        if (!isAuthorized) {
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        const isLinkOwner = true; //TO DO
        if (!isLinkOwner) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }
        const { link_id, token } = req.body;
        const deletionToken = await redisController.get(`${process.env.REDIS_PREFIX}LINK_DELETE_TOKEN_${link_id}`);
        if (deletionToken !== token) {
            return res.status(400).json({error: true, message: "Invalid or expired token."});
        }
        else {
            await redisController.del(`${process.env.REDIS_PREFIX}LINK_DELETE_TOKEN_${link_id}`);
            await Link.destroy({ where: { id: link_id } }); // TO DO: Add error handling for this operation
            return res.status(200).json({error: false, message: "Link successfully deleted."});
        }
        
    }   
    catch (err) {
        console.error("Error in deleteLinkConfirmation:", err);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
}

module.exports = { deleteLinkRequest, deleteLinkConfirmation };