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

module.exports = {
    advisorRegistrationValidateInput,
    advisorOtpValidateInput,
    advisorVerifyValidateInput,
    advisorEmailOtpValidateInput,
    advisorEmailVerifyValidateInput,
};
