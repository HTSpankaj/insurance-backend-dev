const express = require("express");
const {
    getAllInvoiceTemplateController,
} = require("../../../presentation/controller/config/invoiceTemplate.controller");
const { invoiceTemplateGenerationValidator } = require("../../../validator/config/invoiceConfig.validator");

const router = express.Router();

// Format template (Design change)
// router.get("/get-template", getAllInvoiceTemplateController);

router.post("/invoice-template-generation", invoiceTemplateGenerationValidator, getAllInvoiceTemplateController);

module.exports = router;
