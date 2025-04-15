const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const relationshipManagerAssignToLeadControllerValidator = [
    body("lead_product_relation_id")
        .isUUID()
        .withMessage("Lead product relation id must be a valid UUID"),
    body("relationship_manager_id")
        .isUUID()
        .withMessage("Relationship manager id must be a valid UUID"),

    validateClientParametersAndSendResponse,
];

module.exports = { relationshipManagerAssignToLeadControllerValidator };
