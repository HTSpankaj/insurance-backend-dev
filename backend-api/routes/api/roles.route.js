const express = require("express");
const {
    createRoleController,
    getRoleController,
} = require("../../presentation/controller/roles/roles.controller");
const router = express.Router();

router.post("/", createRoleController);
router.get("/", getRoleController);

module.exports = router;
