const express = require("express");
const { getAllInvoiceTemplateController } = require("../../../presentation/controller/config/invoiceTemplate.controller");

const router = express.Router();

router.get("/get-template", getAllInvoiceTemplateController);

module.exports = router;
