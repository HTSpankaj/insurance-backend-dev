const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const insertMobileBannerValidator = [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").isString().notEmpty().withMessage("Description is required"),
    body("is_active").isBoolean().withMessage("is_active must be a boolean"),

    validateClientParametersAndSendResponse,
];
const updateMobileBannerValidator = [
    body("id").isUUID().withMessage("id must be a valid UUID."),
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").isString().notEmpty().withMessage("Description is required"),
    body("is_active").isBoolean().withMessage("is_active must be a boolean"),

    validateClientParametersAndSendResponse,
];

module.exports = { insertMobileBannerValidator, updateMobileBannerValidator };
