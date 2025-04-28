const express = require("express");

const {
    remunerationBankMisUploadExcelValidator,
} = require("../../../validator/Issuance/bankMis.validator");
const {
    afterBankMisExcelDataController,
} = require("../../../presentation/controller/issuance/bankMis.controller");

const router = express.Router();

router.post(
    "/insert-excel-data",
    remunerationBankMisUploadExcelValidator,
    afterBankMisExcelDataController,
);

module.exports = router;
