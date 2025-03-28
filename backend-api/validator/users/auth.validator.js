const { body } = require("express-validator");
const { validateClientParamentesAndSendResponse } = require("../validator");

const loginValidateInput = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    validateClientParamentesAndSendResponse
];

module.exports = { loginValidateInput };
