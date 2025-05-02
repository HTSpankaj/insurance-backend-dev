const express = require("express");
const {
    afterIssuanceExcelDataValidator,
} = require("../../../validator/Issuance/afterIssuance.validator");
const {
    afterIssuanceExcelDataController,
    getExcelDataForAfterIssuanceController,
} = require("../../../presentation/controller/issuance/afterIssuance.controller");

const router = express.Router();

router.get("/get-excel-data-for-after-issuance", getExcelDataForAfterIssuanceController);

router.post(
    "/insert-excel-data",
    afterIssuanceExcelDataValidator,
    afterIssuanceExcelDataController,
);

module.exports = router;
