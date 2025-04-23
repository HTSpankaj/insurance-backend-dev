// ! refer = https://www.twilio.com/docs/sendgrid/for-developers/sending-email/quickstart-nodejs

const sgMail = require("@sendgrid/mail");

// to: 'test@example.com', // Change to your recipient
// from: 'test@example.com', // Change to your verified sender
// subject: 'Sending with SendGrid is Fun',
// text: 'and easy to do anywhere, even with Node.js',
// html: '<strong>and easy to do anywhere, even with Node.js</strong>',
async function sendTwilioEmailMessage(SENDGRID_API_KEY, to, from, subject, text, html) {
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
        to,
        from,
        subject,
        text,
        html,
    };

    return new Promise((resolve, reject) => {
        sgMail
            .send(msg)
            .then(message => {
                console.log("Twilio Email API called successfully. Returned data: ", message);
                resolve({
                    success: true,
                    data: message,
                });
            })
            .catch(err => {
                console.error("Twilio Email API call failed.", err);
                resolve({
                    success: false,
                    error: err,
                });
            });
    });
}

module.exports = { sendTwilioEmailMessage };
