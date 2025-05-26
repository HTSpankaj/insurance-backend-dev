const { body } = require("express-validator");

const { validateClientParametersAndSendResponse } = require("../validator");
const advisorRegistrationValidateInput = [
    body("join_as").notEmpty().withMessage("Join_as is required"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("mobile_number")
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^\d{10}$/)
        .withMessage("Mobile number must be 10 digits"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("aadhar_card_number")
        .notEmpty()
        .withMessage("Aadhar card number is required")
        .matches(/^\d{12}$/)
        .withMessage("Aadhar card number must be 12 digits"),
    body("pan_card_number")
        .notEmpty()
        .withMessage("PAN card number is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .withMessage("PAN card number must be 10 characters (e.g., ABCDE1234F)"),
    // body("gstin_number").notEmpty().withMessage("GST number is required"),
    body("gstin_number").optional(),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("bank_name").notEmpty().withMessage("Bank name is required"),
    body("bank_ifsc_code")
        .notEmpty()
        .withMessage("Bank IFSC code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .withMessage("Bank IFSC code must be 11 characters (e.g., HDFC0001234)"),
    body("bank_branch").notEmpty().withMessage("Bank branch is required"),
    body("bank_account_number")
        .notEmpty()
        .withMessage("Bank account number is required")
        .matches(/^\d{9,18}$/)
        .withMessage("Bank account number must be 9-18 digits"),
    validateClientParametersAndSendResponse,
];
const advisorUpdateRegistrationValidator = [
    body("advisor_id")
        .notEmpty()
        .withMessage("Advisor ID is required")
        .isUUID()
        .withMessage("Invalid advisor ID format"),
    body("bank_details_id")
        .notEmpty()
        .withMessage("Bank details ID is required")
        .isUUID()
        .withMessage("Invalid bank details ID format"),
    body("join_as").notEmpty().withMessage("Join_as is required"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("mobile_number")
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^\d{10}$/)
        .withMessage("Mobile number must be 10 digits"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("aadhar_card_number")
        .notEmpty()
        .withMessage("Aadhar card number is required")
        .matches(/^\d{12}$/)
        .withMessage("Aadhar card number must be 12 digits"),
    body("pan_card_number")
        .notEmpty()
        .withMessage("PAN card number is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .withMessage("PAN card number must be 10 characters (e.g., ABCDE1234F)"),
    body("gstin_number").notEmpty().withMessage("GST number is required"),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("bank_name").notEmpty().withMessage("Bank name is required"),
    body("bank_ifsc_code")
        .notEmpty()
        .withMessage("Bank IFSC code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .withMessage("Bank IFSC code must be 11 characters (e.g., HDFC0001234)"),
    body("bank_branch").notEmpty().withMessage("Bank branch is required"),
    body("bank_account_number")
        .notEmpty()
        .withMessage("Bank account number is required")
        .matches(/^\d{9,18}$/)
        .withMessage("Bank account number must be 9-18 digits"),
    validateClientParametersAndSendResponse,
];

const advisorOtpValidateInput = [
    body("mobile_number")
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^\d{10}$/)
        .withMessage("Mobile number must be 10 digits"),
    body("purpose_for")
        .notEmpty()
        .withMessage("Purpose_for is required")
        .isIn(["registration", "login"])
        .withMessage('Purpose_for must be "registration" or "login"'),
    validateClientParametersAndSendResponse,
];

const advisorVerifyValidateInput = [
    body("token").notEmpty().withMessage("Token is required"),
    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isNumeric()
        .withMessage("OTP must be numeric")
        .isLength({ min: 4, max: 4 })
        .withMessage("OTP must be 4 digits"),
    body("mobile_number")
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^\d{10}$/)
        .withMessage("Mobile number must be 10 digits"),
    body("purpose_for")
        .notEmpty()
        .withMessage("Purpose_for is required")
        .isIn(["registration", "login"])
        .withMessage('Purpose_for must be "registration" or "login"'),
    validateClientParametersAndSendResponse,
];

const advisorEmailOtpValidateInput = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    validateClientParametersAndSendResponse,
];

const advisorEmailVerifyValidateInput = [
    body("token").notEmpty().withMessage("Token is required"),
    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isNumeric()
        .withMessage("OTP must be numeric")
        .isLength({ min: 4, max: 4 })
        .withMessage("OTP must be 4 digits"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    validateClientParametersAndSendResponse,
];

const updateAdvisorTabAccessValidator = [
    body("advisor_id")
        .notEmpty()
        .withMessage("Advisor ID is required")
        .isUUID()
        .withMessage("Invalid advisor ID format"),
    body("tab_access").notEmpty().withMessage("access is required."),
    validateClientParametersAndSendResponse,
];
const activeInactiveAdvisorValidator = [
    body("advisor_id")
        .notEmpty()
        .withMessage("Advisor ID is required")
        .isUUID()
        .withMessage("Invalid advisor ID format"),
    body("advisor_status")
        .notEmpty()
        .withMessage("status is required.")
        .isIn(["Active", "Inactive"])
        .withMessage("status must be Active or Inactive"),
    validateClientParametersAndSendResponse,
];

const upsertAdvisorCompanyAccessValidator = [
    body("advisor_company_access_array")
        .isArray({ min: 1 })
        .withMessage("Data must be a non-empty array"),
    body("advisor_company_access_array.*.advisor_id")
        .isString()
        .notEmpty()
        .withMessage("advisor_id is required"),
    body("advisor_company_access_array.*.company_id")
        .isString()
        .notEmpty()
        .withMessage("company_id is required"),
    body("advisor_company_access_array.*.is_access")
        .isBoolean()
        .withMessage("is_access must be a boolean"),

    validateClientParametersAndSendResponse,
];
const upsertAdvisorCategoryAccessValidator = [
    body("advisor_category_access_array")
        .isArray({ min: 1 })
        .withMessage("Data must be a non-empty array"),
    body("advisor_category_access_array.*.advisor_id")
        .isString()
        .notEmpty()
        .withMessage("advisor_id is required"),
    body("advisor_category_access_array.*.category_id")
        .isString()
        .notEmpty()
        .withMessage("category_id is required"),
    body("advisor_category_access_array.*.is_access")
        .isBoolean()
        .withMessage("is_access must be a boolean"),

    validateClientParametersAndSendResponse,
];
module.exports = {
    advisorRegistrationValidateInput,
    advisorUpdateRegistrationValidator,
    advisorOtpValidateInput,
    advisorVerifyValidateInput,
    advisorEmailOtpValidateInput,
    advisorEmailVerifyValidateInput,
    updateAdvisorTabAccessValidator,
    activeInactiveAdvisorValidator,
    upsertAdvisorCompanyAccessValidator,
    upsertAdvisorCategoryAccessValidator,
};
