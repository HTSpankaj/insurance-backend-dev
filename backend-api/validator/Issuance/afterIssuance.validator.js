const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const afterIssuanceExcelDataValidator = [
    body("data").isArray({ min: 1, max: 20 }).withMessage("Data must be a non-empty array"),
    body("data.*.lead_id").isString().notEmpty().withMessage("lead_id is required"),
    body("data.*.lead_name").isString().notEmpty().withMessage("lead_name is required"),
    body("data.*.product_id")
        .notEmpty()
        .withMessage("product_id is required")
        .matches(/^[A-Z]+-\d{5}$/)
        .withMessage(
            "product_id must follow the format XXX-00000 (e.g., ICI-00001), with uppercase letters only",
        ),
    body("data.*.product_name").isString().notEmpty().withMessage("product_name is required"),
    body("data.*.company_name").isString().notEmpty().withMessage("company_name is required"),
    body("data.*.lead_close_date")
        .isISO8601()
        .withMessage("lead_close_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.start_date_policy")
        .isISO8601()
        .withMessage("start_date_policy must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.end_date_policy")
        .isISO8601()
        .withMessage("end_date_policy must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.policy_amount")
        .isFloat({ min: 0 })
        .withMessage("policy_amount must be a positive number"),
    body("data.*.payout_type")
        .notEmpty()
        .withMessage("payout_type is required")
        .isIn(["One Time", "Monthly", "Quarterly"])
        .withMessage('payout_type must be either "One Time", "Monthly", or "Quarterly"'),
    body("data.*.commission_amount")
        .isFloat({ min: 0 })
        .withMessage("commission_amount must be a positive number"),

    // body("data.*.commission_transaction_number")
    //     .isInt({ min: 1 })
    //     .withMessage("commission_transaction_number must be a positive integer"),

    body("data.*.policy_sold_date")
        .isISO8601()
        .withMessage("policy_sold_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.commission_start_date")
        .isISO8601()
        .withMessage("commission_start_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.commission_end_date")
        .isISO8601()
        .withMessage("commission_end_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.file_name").isString().notEmpty().withMessage("file_name is required"),
    body("data.*.row_number")
        .isInt({ min: 1 })
        .withMessage("row_number must be a positive integer"),

    //  //? Insurance Products//   Part Payment
    //  "issuance_date": "",
    body("data.*.issuance_date")
        .optional()
        .isISO8601()
        .withMessage("issuance_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),

    //  //? Mutual Products//      One Time
    //  "profit_book_amount": "",
    //  "profit_book_date": "",
    body("data.*.profit_book_date")
        .optional()
        .isISO8601()
        .withMessage("profit_book_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.profit_book_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("profit_book_amount must be a positive number"),

    //  //? Loan Products//         One Time
    //  "loan_disbursed_amount": "",
    //  "loan_disbursed_date": "",
    //  "emi_amount": "",

    body("data.*.loan_disbursed_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("loan_disbursed_amount must be a positive number"),
    body("data.*.loan_disbursed_date")
        .optional()
        .isISO8601()
        .withMessage("loan_disbursed_date must be a valid date")
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.emi_amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("emi_amount must be a positive number"),

    validateClientParametersAndSendResponse,
];

module.exports = { afterIssuanceExcelDataValidator };
