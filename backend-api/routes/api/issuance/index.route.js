const express = require("express");
const router = express.Router();

const beforeIssuanceRoute = require("./beforeIssuance.route");
const afterIssuanceRoute = require("./afterIssuance.route");
const bankMisRoute = require("./bankMis.route");

router.use("/before-issuance", beforeIssuanceRoute);
router.use("/after-issuance", afterIssuanceRoute);
router.use("/bank-mis", bankMisRoute);

module.exports = router;
