const express = require("express");
const { getInvoiceViewController } = require("../../presentation/controller/config/invoiceTemplate.controller");

const router = express.Router();

router.get("/get-invoice-view/:invoice_display_id", getInvoiceViewController);

module.exports = router;
