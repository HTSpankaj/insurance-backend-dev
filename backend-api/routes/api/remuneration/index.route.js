const express = require("express");
const router = express.Router();

const {
    getRemunerationDashboardCardStatisticsController,
    getRemunerationDashboardEarningBarStatisticsController,
    getRemunerationCompaniesWithFinancialStatisticsController,
    getRemunerationInvoiceCardStatisticsController,
    getRemunerationInvoiceListForAdminController,
    getInvoiceDetailsByDisplayIdController,
    getRemunerationPaymentListController,
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
    "/get-remuneration-invoice-list-for-admin",
    // authenticateToken,
    getRemunerationInvoiceListForAdminController,
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

router.get(
    "/get-remuneration-payment-list",
    authenticateToken,
    getRemunerationPaymentListController,
);

router.get(
    "/get-invoice-details-by-display-id/:invoice_display_id",
    getInvoiceDetailsByDisplayIdController,
);

router.use("/invoice", invoiceRoute);

module.exports = router;
