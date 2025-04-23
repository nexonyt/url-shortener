const axios = require('axios');

function discordSender(url) {
    const body = {
        application: "url",
        profile: `${url}`
    };

    const discordWebhookURL = 'https://api.nexonstudio.pl/discord/send'; // 

    return axios.post(discordWebhookURL, body)
        .then(response => {
            logger('Wysłano do Discorda:' + response.status, 'INFO');
        })
        .catch(error => {
            logger('Błąd podczas wysyłania do Discorda:' + error.message, 'INFO');
        });
}

module.exports = {discordSender}
