const { validationResult } = require("express-validator");

/* error handler function to validate error message */
exports.validateClientParametersAndSendResponse = (req, res, next, isExcelData = false) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let response = errors.array();
        if (isExcelData) {
            const inputData = req.body.data || [];

            const groupedErrors = {};

            for (const error of response) {
                const match = error.path.match(/^data\[(\d+)\]\./);
                if (match) {
                    const index = Number(match[1]);
                    if (!groupedErrors[index]) {
                        groupedErrors[index] = [];
                    }
                    groupedErrors[index].push(error.msg);
                }
            }

            response = inputData.map((item, index) => ({
                data: item,
                error: groupedErrors[index] || [],
            }));
        }
        return res.status(402).json({
            success: false,
            isParameterError: true,
            error: response,
        });
    }
    next();
};
