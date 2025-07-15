const axios = require("axios");
const { brevoConfig } = require("../../configs/brevo.config");

const apiKey = brevoConfig.apiKey;

function sendBrevoWhatsAppMessage(text, contactNumbers) {
    const url = "https://api.brevo.com/v3/whatsapp/sendMessage";

    return new Promise((resolve, reject) => {
        const data = {
            senderNumber: brevoConfig?.whatsappSenderNumber,
            text,
            contactNumbers,
        };

        const headers = {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": apiKey,
        };

        axios
            .post(url, data, { headers })
            .then(response => {
                console.log("Brevo WhatsApp API called successfully. Returned data: ", data);
                resolve(response?.data);
            })
            .catch(error => {
                console.error("Brevo WhatsApp API call failed.", error);
                reject(error);
            });
    });
}

module.exports = { sendBrevoWhatsAppMessage };
