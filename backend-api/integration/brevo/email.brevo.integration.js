//?Reference: https://github.com/getbrevo/brevo-node

const brevo = require("@getbrevo/brevo");
const { brevoConfig } = require("../../configs/brevo.config");

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = brevoConfig.apiKey;
/**
 * Send email using Brevo SMTP
 * @param {string} subject - Subject of email
 * @param {string} htmlContent - HTML content of email
 * @param {string} senderName - Name of the sender
 * @param {string} senderEmail - Email of the sender
 * @param {Array} toArray - Array of email addresses to send email to
 * Each object should contain an email and name of the recipient. { "email": "email@gmail.com", "name": "Full Name" }
 * @param {Array} attachments - Array of attachments
 * Each object should contain a file and filename of the attachment. { "url": "www.example.com/file.txt", "name": "file.txt" } OR { "content": "Base64 encoded chunk data", "name": "file.txt" }
 */
function sendBrevoEmailMessage(subject, htmlContent, toArray, attachments = []) {
    return new Promise((resolve, reject) => {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = {
            name: brevoConfig.senderName,
            email: brevoConfig.senderEmail,
        };
        sendSmtpEmail.to = toArray;

        if (attachments && attachments?.length > 0) {
            let email_attachments = [];
            for (let index = 0; index < attachments.length; index++) {
                const attachment_item = attachments[index];
                if (attachment_item?.content && attachment_item?.name) {
                    email_attachments.push({
                        content: attachment_item.content,
                        name: attachment_item.name,
                    });
                } else if (attachment_item.url) {
                    email_attachments.push({
                        url: attachment_item.url,
                        name: attachment_item.name,
                    });
                } else {
                    reject("Invalid attachment");
                    break;
                }
            }
            sendSmtpEmail.attachment = email_attachments;
        }
        // sendSmtpEmail.replyTo = { "email": "shubham.upadhyay@sendinblue.com", "name": "Shubham Upadhyay" };
        // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };

        apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function (data) {
                // console.log(
                //     "Brevo Email API called successfully. Returned data: " + JSON.stringify(data),
                // );
                resolve(data);
            },
            function (error) {
                console.error("Brevo Email API call failed.", error?.response?.body);
                reject(error?.response?.body || error?.response || error);
            },
        );
    });
}

module.exports = { sendBrevoEmailMessage };
