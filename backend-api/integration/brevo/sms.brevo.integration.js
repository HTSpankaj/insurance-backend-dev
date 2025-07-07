//?Reference: https://developers.brevo.com/reference/sendtransacsms

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const { brevoConfig } = require("../../configs/brevo.config");

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = brevoConfig.apiKey;

/**
 * Send SMS using Brevo SMS
 * @param {string} sender - Name or Number of the sender
 * @param {string} recipient - Mobile number of the recipient
 * @param {string} content - Content of the message
 * @returns {Promise} - Promise that resolves with the response data or rejects with the error
 */
function sendBrevoSmsMessage(recipient, content) {
    return new Promise((resolve, reject) => {
        let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
        let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

        sendTransacSms = {
            "sender": brevoConfig.smsSender,
            "recipient": "+91" + recipient,
            "content": content,
        };

        console.log("recipient:", sendTransacSms.recipient);

        apiInstance.sendTransacSms(sendTransacSms).then(
            function (data) {
                console.log("Brevo SMS API called successfully. Returned data: ", data);
                resolve(data);
            },
            function (error) {
                console.error("Brevo SMS API call failed.", error?.response?.body || error?.response || error);
                reject(error?.response?.body || error?.response || error);
            },
        );
    });
}

module.exports = { sendBrevoSmsMessage };
