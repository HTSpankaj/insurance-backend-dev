const twilio = require("twilio");

const accountSid = "ACa5bd1708e1dbe79f75e38193d5137205";
const authToken = "89fd5f1437e862a02c1f00cdabc776de";
const client = twilio(accountSid, authToken);

async function createVerification() {
    //   const verification = await client.verify.v2
    //     .services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    //     .verifications.create({
    //       channel: "whatsapp",
    //       to: "+919130743559",
    //     });
    // console.log(verification.accountSid);

    client.verify.v2.services("HXbe43668d5842958747aa38c1f29083d2").verifications.create({
        channel: "whatsapp",
        to: "+  ",
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = { createVerification };
