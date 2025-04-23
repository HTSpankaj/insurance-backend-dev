// ! refer = https://www.twilio.com/docs/messaging/quickstart/node

const twilio = require("twilio");

async function sendTwilioSmsMessage(accountSid, authToken, body, from, to) {
    const client = twilio(accountSid, authToken);

    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body,
                from,
                to,
            })
            .then(message => {
                console.log("Twilio SMS API called successfully. Returned data: ", message);
                resolve({
                    success: true,
                    data: message,
                });
            })
            .catch(err => {
                console.error("Twilio SMS API call failed.", err);
                resolve({
                    success: false,
                    error: err,
                });
            });
    });
}

module.exports = { sendTwilioSmsMessage };
