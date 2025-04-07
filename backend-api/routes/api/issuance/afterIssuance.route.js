const express = require("express");
const {
    afterIssuanceExcelDataValidator
} = require("../../../validator/Issuance/afterIssuance.validator");
const { afterIssuanceExcelDataController } = require("../../../presentation/controller/issuance/afterIssuance.controller");

const router = express.Router();

router.post("/insert-excel-data", afterIssuanceExcelDataValidator, afterIssuanceExcelDataController

);

module.exports = router;
