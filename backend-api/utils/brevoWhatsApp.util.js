const axios = require("axios");
const apiKey = "dddd"; // Replace with your actual API key

function sendWhatsAppMessage(senderNumber, text, contactNumbers) {
    const url = "https://api.brevo.com/v3/whatsapp/sendMessage";

    return new Promise((resolve, reject) => {
        const data = {
            senderNumber,
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

module.exports = { sendWhatsAppMessage };
