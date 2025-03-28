const cryptoJs = require("crypto-js");
const crypto = require("crypto");
var { secretKey } = require("../configs/auth.config").authConfig;

function encryptPassword(password) {
  return cryptoJs.AES.encrypt(password, secretKey).toString();
}
function decryptPassword(encryptedPassword) {
  return cryptoJs.AES.decrypt(encryptedPassword, secretKey).toString(
    cryptoJs.enc.Utf8
  );
}

/* generate random otp */
function generateOtp(length) {
  return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length));
}
module.exports = { encryptPassword, decryptPassword, generateOtp };
