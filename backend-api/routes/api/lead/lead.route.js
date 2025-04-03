const express = require("express");

const {
    getLeadListController,
    addLeadController,
    getLeadStatisticsNumberController,
} = require("../../../presentation/controller/lead/lead.controller");

const { authenticateToken, advisorAuthenticateToken } = require("../../../middleware/auth");
const router = express.Router();

router.get("/lead-list", getLeadListController);
router.post("/add-lead", advisorAuthenticateToken, addLeadController);
router.get("/lead-statistics-number", authenticateToken, getLeadStatisticsNumberController);

module.exports = router;
