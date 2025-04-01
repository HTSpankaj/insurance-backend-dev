const express = require("express");
const {
    createAdvisorController,
    sendAdvisorOtpController,
    verifyAdvisorMobileController,
    sendAdvisorEmailOtpController,
    verifyAdvisorEmailController,
    getAdvisorStatisticsController,
    getAdvisorListController,
    getAdvisorDetailsByIdController,
    approveAdvisorRequestController,
    rejectAdvisorRequestController,
    resubmitAdvisorRequestController,
} = require("../../../presentation/controller/advisor/advisor.controller");
const upload = require("../../../middleware/multer.middleware");
const {
    advisorRegistrationValidateInput,
    advisorOtpValidateInput,
    advisorVerifyValidateInput,
    advisorEmailOtpValidateInput,
    advisorEmailVerifyValidateInput,
} = require("../../../middleware/validation.middleware");
const { authenticateToken } = require("../../../middleware/auth");

const router = express.Router();

//!~~~~~~~~~~~~~~~~~~~ Request send from Advisor app ~~~~~~~~~~~~~~~~~~~
// router.post(
//     "/advisor-registration",
//     upload,
//     advisorRegistrationValidateInput,
//     createAdvisorController,
// );
router.post("/advisor-mobile-send-otp", advisorOtpValidateInput, sendAdvisorOtpController);
router.post("/advisor-mobile-verify", advisorVerifyValidateInput, verifyAdvisorMobileController);
router.post("/advisor-email-send-otp", advisorEmailOtpValidateInput, sendAdvisorEmailOtpController);
router.post("/advisor-email-verify", advisorEmailVerifyValidateInput, verifyAdvisorEmailController);

//!~~~~~~~~~~~~~~~~~~~ Request send from admin portal ~~~~~~~~~~~~~~~~~~~
router.get("/advisor-statistics-number", authenticateToken, getAdvisorStatisticsController);
router.get("/advisor-list", authenticateToken, getAdvisorListController);
router.get("/advisor-details/:id", authenticateToken, getAdvisorDetailsByIdController);
router.put("/advisor-request-approve", authenticateToken, approveAdvisorRequestController);
router.put("/advisor-request-reject", authenticateToken, rejectAdvisorRequestController);
router.put("/advisor-request-resubmit", authenticateToken, resubmitAdvisorRequestController);

module.exports = router;
