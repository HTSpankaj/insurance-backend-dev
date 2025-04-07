const express = require("express");
const router = express.Router();

const beforeIssuanceRoute = require("./beforeIssuance.route");
const afterIssuanceRoute = require("./afterIssuance.route");

router.use("/before-issuance", beforeIssuanceRoute);
router.use("/after-issuance", afterIssuanceRoute);

module.exports = router;
