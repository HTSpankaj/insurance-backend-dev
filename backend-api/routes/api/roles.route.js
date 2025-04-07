const express = require("express");
const {
    createRoleController,
    getRoleController,
    updateRoleController,
    deleteRoleController,
} = require("../../presentation/controller/roles/roles.controller");
const router = express.Router();

router.post("/", createRoleController);
router.get("/", getRoleController);
router.put("/:role_id", updateRoleController);
router.delete("/:role_id", deleteRoleController);

module.exports = router;
