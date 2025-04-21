const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const remunerationExcelValidator = [
    body("data.*.advisor_name")
        .notEmpty()
        .withMessage("Advisor Name is required")
        .isString()
        .withMessage("Advisor Name must be a string"),

    body("data.*.advisor_id")
        .notEmpty()
        .withMessage("Advisor ID is required")
        .matches(/^ADV-\d+$/)
        .withMessage("Advisor ID must be in the format ADV-<number> (e.g., ADV-100)"),

    body("data.*.lead_name")
        .notEmpty()
        .withMessage("Lead Name is required")
        .isString()
        .withMessage("Lead Name must be a string"),

    body("data.*.lead_id")
        .notEmpty()
        .withMessage("Lead ID is required")
        .matches(/^LED-\d+$/)
        .withMessage("Lead ID must be in the format LED-<number> (e.g., LED-100)"),

    body("data.*.commission_paid")
        .notEmpty()
        .withMessage("Commission Paid is required")
        .isFloat({ min: 0 })
        .withMessage("Commission Paid must be a positive number"),

    body("data.*.policy_sold")
        .notEmpty()
        .withMessage("Policy Sold is required")
        .isString()
        .withMessage("Policy Sold must be a string"),

    body("data.*.transaction_ref_no")
        .notEmpty()
        .withMessage("Transaction Reference Number is required")
        .matches(/^[A-Z0-9\-]{6,30}$/)
        .withMessage(
            "Transaction Reference Number must be alphanumeric, 6-30 characters (e.g., TXN-123456)",
        ),

    body("data.*.payment_date")
        .notEmpty()
        .withMessage("Payment Date is required")
        .isISO8601()
        .withMessage("Payment Date must be a valid date in YYYY-MM-DD format"),

    body("data.*.payment_mode")
        .notEmpty()
        .withMessage("Payment Mode is required")
        .isIn(["Bank Transfer", "UPI", "Cheque"])
        .withMessage("Payment Mode must be one of: Bank Transfer, UPI, Cheque"),

    validateClientParametersAndSendResponse,
];
module.exports = { remunerationExcelValidator };

// Advisor Name
// Advisor ID
// Lead Name
// Lead ID
// Commission Paid
// Policy Sold
// Transaction Reference Number (for payout processing) (what format , what more fields needed here)
// Payment Date
// Payment Mode (Bank Transfer / UPI / Cheque)
