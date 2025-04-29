const express = require("express");
const router = express.Router();

const {
    getRemunerationDashboardCardStatisticsController,
    getRemunerationDashboardEarningBarStatisticsController,
    getRemunerationCompaniesWithFinancialStatisticsController,
    getRemunerationInvoiceCardStatisticsController,
} = require("../../../presentation/controller/remuneration/remuneration.controller");

const invoiceRoute = require("./invoice.route");
const { authenticateToken } = require("../../../middleware/auth");

router.get(
    "/get-remuneration-dashboard-card-statistics",
    authenticateToken,
    getRemunerationDashboardCardStatisticsController,
);

router.get(
    "/get-remuneration-invoice-card-statistics",
    // authenticateToken,
    getRemunerationInvoiceCardStatisticsController,
);

router.get(
    "/get-remuneration-dashboard-earning-bar",
    authenticateToken,
    getRemunerationDashboardEarningBarStatisticsController,
);

router.get(
    "/get-remuneration-company-with-financial-statistics",
    authenticateToken,
    getRemunerationCompaniesWithFinancialStatisticsController,
);

router.use("/invoice", invoiceRoute);

module.exports = router;
