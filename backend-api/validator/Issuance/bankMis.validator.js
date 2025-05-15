const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const remunerationBankMisUploadExcelValidator = [
    body("data").isArray({ min: 1, max: 20 }).withMessage("Data must be a non-empty array"),

    body("data.*.advisor_name")
        .notEmpty()
        .withMessage("advisor_name is required")
        .isString()
        .withMessage("advisor_name must be a string"),

    body("data.*.advisor_id")
        .notEmpty()
        .withMessage("advisor_id is required")
        .matches(/^ADV-\d+$/)
        .withMessage("advisor_id must be in the format ADV-<number> (e.g., ADV-123)"),

    body("data.*.commission_paid")
        .notEmpty()
        .withMessage("commission_paid is required")
        .isFloat({ min: 0 })
        .withMessage("commission_paid must be a positive number"),

    body("data.*.transaction_reference_number")
        .notEmpty()
        .withMessage("transaction_reference_number is required")
        .isString()
        .withMessage("transaction_reference_number must be a string"),

    body("data.*.payment_date").notEmpty().withMessage("payment_date is required"),
    // .isISO8601()
    // .withMessage("payment_date must be a valid date (YYYY-MM-DD)")
    // .isDate({ format: "YYYY-MM-DD" })
    // .withMessage("Date must be in YYYY-MM-DD format"),

    body("data.*.payment_mode")
        .notEmpty()
        .withMessage("payment_mode is required")
        .isIn(["Bank Transfer", "UPI", "Cheque"])
        .withMessage("payment_mode must be one of: Bank Transfer, UPI, Cheque"),
    body("data.*.file_name").isString().notEmpty().withMessage("file_name is required"),
    body("data.*.row_number")
        .isInt({ min: 1 })
        .withMessage("row_number must be a positive integer"),
    (req, res, next) => {
        validateClientParametersAndSendResponse(req, res, next, true);
    },
];

module.exports = { remunerationBankMisUploadExcelValidator };

// advisor_name
// advisor_id
//! lead Name
//! Lead ID
// commission_paid
//! Policy Sold
// transaction_reference_number (for payout processing) (what format , what more fields needed here)
// payment_date
// payment_mode (Bank Transfer / UPI / Cheque)
