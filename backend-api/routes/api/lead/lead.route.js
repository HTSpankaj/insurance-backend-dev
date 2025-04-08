const express = require("express");

const {
    getLeadListController,
    addLeadController,
    getLeadStatisticsNumberController,
    leadMobileSendOtpController,
    leadMobileVerifyController,
    getLeadListProductByAdvisorIdController,
} = require("../../../presentation/controller/lead/lead.controller");

const { authenticateToken, advisorAuthenticateToken } = require("../../../middleware/auth");
const router = express.Router();

router.get("/lead-list", getLeadListController);
router.get("/lead-list-product-by-advisor-id", getLeadListProductByAdvisorIdController);
router.post("/add-lead", advisorAuthenticateToken, addLeadController);
router.get("/lead-statistics-number", authenticateToken, getLeadStatisticsNumberController);
router.post("/lead-mobile-send-otp", leadMobileSendOtpController);
router.post("/lead-mobile-verify", leadMobileVerifyController);

module.exports = router;
