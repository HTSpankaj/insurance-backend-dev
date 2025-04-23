// ! refer = https://www.twilio.com/docs/whatsapp/api#code-send-an-outbound-freeform-whatsapp-message

const twilio = require("twilio");

async function sendTwilioWhatsappMessage(accountSid, authToken, body, from, to) {
    const client = twilio(accountSid, authToken);

    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body,
                from: `whatsapp:${from}`,
                to: `whatsapp:${from}`,
            })
            .then(message => {
                console.log("Twilio WhatsApp API called successfully. Returned data: ", message);
                resolve({
                    success: true,
                    data: message,
                });
            })
            .catch(err => {
                console.error("Twilio WhatsApp API call failed.", err);
                resolve({
                    success: false,
                    error: err,
                });
            });
    });
}

module.exports = { sendTwilioWhatsappMessage };
