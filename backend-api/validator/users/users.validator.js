const { body, param, query } = require("express-validator");
const { validateClientParamentesAndSendResponse } = require("../validator");

const getUsersValidation = [
  query("page").default(1).toInt(),
  query("limit").default(10).toInt(),
  query("search"),
  query("is_all")
    .toBoolean()
    .isBoolean({ strict: true })
    .withMessage("is_all must be either true or false"),
  validateClientParamentesAndSendResponse,
];

const getUserByIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("User id is required")
    .isUUID()
    .withMessage("Invalid user id format"),
  validateClientParamentesAndSendResponse,
];

const addUserValidation = [
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("First name must be between 2 and 20 characters"),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Last name must be between 2 and 20 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phone_number")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits")
    .matches(/^\d+$/)
    .withMessage("Mobile number must contain only digits"),

  body("password")
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("role_id")
    .notEmpty()
    .withMessage("Role id is required")
    .isUUID()
    .withMessage("Invalid role id format"),
  validateClientParamentesAndSendResponse,
];

const updateUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("User id is required")
    .isUUID()
    .withMessage("Invalid user id format"),

  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("First name must be between 2 and 20 characters"),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Last name must be between 2 and 20 characters"),

  body("phone_number")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits")
    .matches(/^\d+$/)
    .withMessage("Mobile number must contain only digits"),

  body("role_id")
    .notEmpty()
    .withMessage("Role id is required")
    .isUUID()
    .withMessage("Invalid role id format"),
  validateClientParamentesAndSendResponse,
];

const deleteUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("User id is required")
    .isUUID()
    .withMessage("Invalid user id format"),
  validateClientParamentesAndSendResponse,
];

const activeDeactiveUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("User id is required")
    .isUUID()
    .withMessage("Invalid user id format"),

  body("is_active")
    .notEmpty()
    .withMessage("is_active is required")
    .isBoolean({ strict: true })
    .withMessage("is_active must be either true or false"),
  validateClientParamentesAndSendResponse,
];

module.exports = {
  getUsersValidation,
  getUserByIdValidation,
  addUserValidation,
  updateUserValidation,
  deleteUserValidation,
  activeDeactiveUserValidation,
};
