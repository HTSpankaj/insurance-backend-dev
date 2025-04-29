const express = require("express");
const router = express.Router();

const advisorAccessConfigRoute = require("./advisorAccessConfig.route");
const mobileBannerConfigRoute = require("./mobileBanner.route");
const InvoiceSchedulerConfigRoute = require("./InvoiceSchedulerConfig.route");
const { authenticateToken } = require("../../../middleware/auth");

router.use("/advisor-access", authenticateToken, advisorAccessConfigRoute);
router.use("/mobile-banner", mobileBannerConfigRoute);
router.use("/invoice-scheduler", InvoiceSchedulerConfigRoute);

module.exports = router;
