const express = require("express");
const { beforeIssuanceExcelDataValidator } = require("../../../validator/Issuance/beforeIssuance.validator");

const router = express.Router();

// router.post("/excel-data", beforeIssuanceExcelDataValidator, beforeIssuanceExcelDataController);

module.exports = router;
