const express = require("express");
const router = express.Router();

const advisorAccessConfigRoute = require("./advisorAccessConfig.route");
const mobileBannerConfigRoute = require("./mobileBanner.route");
const InvoiceSchedulerConfigRoute = require("./InvoiceSchedulerConfig.route");
const InvoiceTemplateRoute = require("./InvoiceTemplate.route");
const { authenticateToken } = require("../../../middleware/auth");

router.use("/advisor-access", advisorAccessConfigRoute);
router.use("/mobile-banner", mobileBannerConfigRoute);
router.use("/invoice-scheduler", InvoiceSchedulerConfigRoute);
router.use("/invoice-config", InvoiceTemplateRoute);

module.exports = router;
