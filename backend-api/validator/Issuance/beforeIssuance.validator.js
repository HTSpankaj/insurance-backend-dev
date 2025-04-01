const { body } = require("express-validator");
const { validateClientParamentesAndSendResponse } = require("../validator");

const beforeIssuanceExcelDataValidator = [
    body("data")
      .isArray({ min: 1, max: 20 })
      .withMessage("Data must be a non-empty array"),
    body("data.*.lead_id").isString().notEmpty().withMessage("lead_id is required"),
    body("data.*.lead_name").isString().notEmpty().withMessage("lead_name is required"),
    body("data.*.product_id").isString().notEmpty().withMessage("product_id is required"),
    body("data.*.product_name").isString().notEmpty().withMessage("product_name is required"),
    body("data.*.company_name").isString().notEmpty().withMessage("company_name is required"),
    body("data.*.company_id").isString().notEmpty().withMessage("company_id is required"),
    body("data.*.lead_close_date").isISO8601().withMessage("lead_close_date must be a valid date").isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.start_date_policy").isISO8601().withMessage("start_date_policy must be a valid date").isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.end_date_policy").isISO8601().withMessage("end_date_policy must be a valid date").isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be in YYYY-MM-DD format"),
    body("data.*.policy_amount").isFloat({ min: 0 }).withMessage("policy_amount must be a positive number"),
    body("data.*.payout_type").isString().notEmpty().withMessage("payout_type is required"),
    body("data.*.commission_amount")
      .isFloat({ min: 0 })
      .withMessage("commission_amount must be a positive number"),
    body("data.*.file_name").isString().notEmpty().withMessage("file_name is required"),
    body("data.*.row_number").isInt({ min: 1 }).withMessage("row_number must be a positive integer"),
    
    validateClientParamentesAndSendResponse
  ];
  

module.exports = { beforeIssuanceExcelDataValidator };
