const { validationResult } = require("express-validator");

/* error handler function to validate error message */
exports.validateClientParametersAndSendResponse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).json({
            success: false,
            isParameterError: true,
            error: errors.array(),
        });
    }
    next();
};
