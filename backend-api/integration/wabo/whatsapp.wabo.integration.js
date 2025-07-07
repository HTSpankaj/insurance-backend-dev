const axios = require("axios");
const { brevoConfig } = require("../../configs/brevo.config");
const { waboConfig } = require("../../configs/wabo.config");

const apiKey = brevoConfig.apiKey;

const getaHost = waboConfig.getaHost;

function sendWaboWhatsAppMessage(
    templateName,
    contactNumbers,
    bodyComponents = [],
    otherComponents = [],
) {
    const url = "https://api-whatsapp.geta.ai/api/v1/whatsapp/send_template_message";

    return new Promise((resolve, reject) => {
        console.log("contactNumbers", contactNumbers);

        const data = {
            "to": contactNumbers,
            "content": {
                "type": "Template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": "en",
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": bodyComponents,
                        },
                        ...otherComponents,
                    ],
                },
            },
            // "template_category": "MARKETING"
        };

        const headers = {
            accept: "application/json",
            "content-type": "application/json",
            "geta-host": getaHost,
        };

        axios
            .post(url, data, { headers })
            .then(response => {
                resolve(response?.data);
            })
            .catch(error => {
                console.error(
                    "Wabo WhatsApp API call failed.",
                    error?.response?.data || error?.response || error,
                );
                reject(error?.response?.data || error?.response || error);
            });
    });
}

module.exports = { sendWaboWhatsAppMessage };
