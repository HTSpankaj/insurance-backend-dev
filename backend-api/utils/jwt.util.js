const jwt = require("jsonwebtoken");
const { authConfig } = require("../configs/auth.config");

const otpSecretKey = authConfig.otpSecretKey;
const otpTokenExpiry = authConfig.otpTokenExpiry;

const verifyOtpToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, otpSecretKey, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    resolve({
                        success: false,
                        message: "Token is expired.",
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Invalid Token.",
                    });
                }
            }
            resolve({
                success: true,
                data: decoded,
            });
        });
    });
};

const generateOtpToken = payload => {
    const options = { expiresIn: otpTokenExpiry };
    return jwt.sign(payload, otpSecretKey, options);
};

module.exports = {
    verifyOtpToken,
    generateOtpToken,
};
