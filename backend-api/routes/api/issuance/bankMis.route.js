const express = require("express");

const {
    remunerationBankMisUploadExcelValidator,
} = require("../../../validator/Issuance/bankMis.validator");
const {
    afterBankMisExcelDataController,
    getExcelDataForBankMisDownloadController,
} = require("../../../presentation/controller/issuance/bankMis.controller");

const router = express.Router();

router.get("/get-excel-data-for-bank-mis-download", getExcelDataForBankMisDownloadController);

router.post(
    "/insert-excel-data",
    remunerationBankMisUploadExcelValidator,
    afterBankMisExcelDataController,
);

module.exports = router;
