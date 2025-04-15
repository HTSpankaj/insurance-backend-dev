const express = require("express");
const {
    addRelationshipManagerController,
    relationshipManagerAssignToLeadController,
} = require("../../../presentation/controller/relationship-manager/relationship-manager.controller");
const {
    getRelationshipManagerListByCompanyIdController,
} = require("../../../presentation/controller/relationship-manager/relationship-manager.controller");
const {
    relationshipManagerAssignToLeadControllerValidator,
} = require("../../../validator/relationship_manager/relationship_manager.validator");
const router = express.Router();

router.post("/add-relationship-manager", addRelationshipManagerController);
router.post(
    "/assign-relationship-manager-to-lead",
    relationshipManagerAssignToLeadControllerValidator,
    relationshipManagerAssignToLeadController,
);
router.get(
    "/get-relationship-manager-list-by-company-id/:id",
    getRelationshipManagerListByCompanyIdController,
);

module.exports = router;
