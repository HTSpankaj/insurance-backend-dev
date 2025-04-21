const express = require("express");
const router = express.Router();

const {
    getRemunerationDashboardCardStatisticsController,
    getRemunerationDashboardEarningBarStatisticsController,
} = require("../../../presentation/controller/remuneration/remuneration.controller");

// const beforeIssuanceRoute = require("./beforeIssuance.route");
// const afterIssuanceRoute = require("./afterIssuance.route");

// router.use("/before-issuance", beforeIssuanceRoute);
// router.use("/after-issuance", afterIssuanceRoute);

router.get(
    "/get-remuneration-dashboard-card-statistics",
    getRemunerationDashboardCardStatisticsController,
);

router.get(
    "/get-remuneration-dashboard-earning-bar",
    getRemunerationDashboardEarningBarStatisticsController,
);

module.exports = router;
