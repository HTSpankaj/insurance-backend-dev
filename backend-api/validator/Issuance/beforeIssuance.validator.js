const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const beforeIssuanceExcelDataValidator = [
    body("data").isArray({ min: 1, max: 20 }).withMessage("Data must be a non-empty array"),
    body("data.*.lead_id")
        .notEmpty()
        .withMessage("lead_id is required")
        .matches(/^LED-\d+$/)
        .withMessage("lead_id must be in the format LED-<number> (e.g., LED-1, LED-100)"),
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
    body("data.*.lead_product_relation_id")
        .notEmpty()
        .withMessage("lead_product_relation_id is required")
        .matches(/^LPR-\d+$/)
        .withMessage(
            "lead_product_relation_id must be in the format LPR-<number> (e.g., LPR-1, LPR-4434)",
        ),
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
    body("data.*.file_name").isString().notEmpty().withMessage("file_name is required"),
    body("data.*.row_number")
        .isInt({ min: 1 })
        .withMessage("row_number must be a positive integer"),

    validateClientParametersAndSendResponse,
];

module.exports = { beforeIssuanceExcelDataValidator };
