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
    upsertAdvisorCompanyAccessController,
    getAdvisorCompanyAccessController,
    getAdvisorCategoryAccessController,
    upsertAdvisorCategoryAccessController,
    updateAdvisorTabAccessController,
    activeInactiveAdvisorController,
} = require("../../../presentation/controller/advisor/advisor.controller");
const upload = require("../../../middleware/multer.middleware");

const {
    advisorRegistrationValidateInput,
    advisorOtpValidateInput,
    advisorVerifyValidateInput,
    advisorEmailOtpValidateInput,
    advisorEmailVerifyValidateInput,
    upsertAdvisorCompanyAccessValidator,
    upsertAdvisorCategoryAccessValidator,
    updateAdvisorTabAccessValidator,
    activeInactiveAdvisorValidator,
    advisorUpdateRegistrationValidator,
} = require("../../../validator/advisor/advisor.validator");

const { authenticateToken } = require("../../../middleware/auth");

const router = express.Router();

//!~~~~~~~~~~~~~~~~~~~ Request send from Advisor app ~~~~~~~~~~~~~~~~~~~
router.post(
    "/advisor-registration",
    upload,
    advisorRegistrationValidateInput,
    createAdvisorController,
);
router.post(
    "/resubmit-advisor-registration",
    upload,
    advisorUpdateRegistrationValidator,
    createAdvisorController,
);
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
router.put(
    "/advisor-tab-access",
    updateAdvisorTabAccessValidator,
    authenticateToken,
    updateAdvisorTabAccessController,
);
router.put(
    "/active-inactive-advisor",
    activeInactiveAdvisorValidator,
    authenticateToken,
    activeInactiveAdvisorController,
);
// router.put("/advisor-request-resubmit", authenticateToken, resubmitAdvisorRequestController);

//* Company Access
router.get("/get-advisor-company-access", getAdvisorCompanyAccessController);
router.put(
    "/upsert-advisor-company-access",
    upsertAdvisorCompanyAccessValidator,
    authenticateToken,
    upsertAdvisorCompanyAccessController,
);

//* Category Access
router.get("/get-advisor-category-access", getAdvisorCategoryAccessController);
router.put(
    "/upsert-advisor-category-access",
    upsertAdvisorCategoryAccessValidator,
    authenticateToken,
    upsertAdvisorCategoryAccessController,
);

module.exports = router;
