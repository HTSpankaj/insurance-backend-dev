const jwt = require("jsonwebtoken");
const { authConfig } = require("../configs/auth.config");

const secretKey = authConfig.secretKey;

const generateToken = (payload, tokenExperiyTime) => {
    const options = { expiresIn: tokenExperiyTime };
    return jwt.sign(payload, secretKey, options);
};

const verifyToken = access_token => {
    try {
        const decoded = jwt.verify(access_token, secretKey);
        return decoded;
    } catch (error) {
        return null;
    }
};

//* Middleware For Admin Portal
const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];

        // if (process.env.NODE_ENV?.trim() || process.env.NODE_ENV?.trim() === "development") {
        //     next();
        //     return true;
        // }

        if (!token)
            return res
                .status(401)
                .json({ success: false, message: "Access Denied. No token provided." });
        jwt.verify(token, secretKey, (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send({ success: false, message: "Token is expired." });
                } else {
                    return res.status(401).send({
                        success: false,
                        message: err?.message ? err.message : "Invalid Token.",
                    });
                }
            } else {
                res.locals.tokenData = authData;
                next();
            }
        });
    } catch (error) {
        let _error = error?.message ? error?.message : error;
        return res.status(401).send({ success: false, message: _error });
    }
};

//* Middleware For Advisor App
const advisorAuthenticateToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token)
            return res
                .status(401)
                .json({ success: false, message: "Access Denied. No token provided." });
        jwt.verify(token, secretKey, (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send({ success: false, message: "Token is expired." });
                } else {
                    return res.status(401).send({
                        success: false,
                        message: err?.message ? err.message : "Invalid Token.",
                    });
                }
            } else {
                if (authData?.advisor_id) {
                    res.locals.tokenData = authData;
                    next();
                } else {
                    const _err = {
                        message: "Invalid Token.",
                    };
                    throw _err;
                }
            }
        });
    } catch (error) {
        let _error = error?.message ? error?.message : error;
        return res.status(401).send({ success: false, message: _error });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    advisorAuthenticateToken,
};
