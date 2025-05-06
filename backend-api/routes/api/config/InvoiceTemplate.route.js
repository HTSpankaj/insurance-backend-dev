const express = require("express");
const {
    getAllInvoiceTemplateController,
    getInvoiceTemplateGenerationController,
    uploadInvoiceTemplateGenerationLogoController,
    invoiceTemplateGenerationController,
    updateInvoiceTemplateGenerationController,
} = require("../../../presentation/controller/config/invoiceTemplate.controller");
const {
    invoiceTemplateGenerationValidator,
    updateInvoiceTemplateGenerationValidator,
} = require("../../../validator/config/invoiceConfig.validator");
const {
    uploadInvoiceTemplateGenerationLogoMulter,
} = require("../../../middleware/config.middleware");

const router = express.Router();

// Format template (Design change)
// router.get("/get-template", getAllInvoiceTemplateController);

router.post(
    "/invoice-template-generation",
    invoiceTemplateGenerationValidator,
    invoiceTemplateGenerationController,
);
router.put(
    "/update-invoice-template-generation",
    updateInvoiceTemplateGenerationValidator,
    updateInvoiceTemplateGenerationController,
);
router.get("/get-invoice-template-generation", getInvoiceTemplateGenerationController);
router.put(
    "/upload-invoice-template-generation-logo",
    uploadInvoiceTemplateGenerationLogoMulter,
    uploadInvoiceTemplateGenerationLogoController,
);

module.exports = router;

// Lead Name
// Lead ID
// Lead Email
// Lead Contact Number
// Product Interest
// Product Category
// Product Tax
// Commission
