const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const advisorUpdateConfigValidator = [
    body("title").isString().notEmpty().withMessage("Title is required."),
    body("id").isUUID().withMessage("id must be a valid UUID."),
    body("access").isJSON().notEmpty().withMessage("access is required."),

    validateClientParametersAndSendResponse,
];

module.exports = { advisorUpdateConfigValidator };
