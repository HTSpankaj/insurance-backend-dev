const express = require("express");
const {
    addRelationshipManagerController,
} = require("../../../presentation/controller/relationship-manager/relationship-manager.controller");
const {
    getRelationshipManagerListByCompanyIdController,
} = require("../../../presentation/controller/relationship-manager/relationship-manager.controller");
const router = express.Router();

router.post("/add-relationship-manager", addRelationshipManagerController);
router.get(
    "/get-relationship-manager-list-by-company-id/:id",
    getRelationshipManagerListByCompanyIdController,
);

module.exports = router;
