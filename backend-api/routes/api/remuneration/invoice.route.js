const express = require("express");
const { advisorAuthenticateToken } = require("../../../middleware/auth");
const {
    getAdvisorInvoiceController,
    approveInvoiceController,
    rejectionInvoiceController,
} = require("../../../presentation/controller/remuneration/invoice.controller");

const router = express.Router();

router.get("/get-advisor-invoice", advisorAuthenticateToken, getAdvisorInvoiceController);
router.put("/approve-invoice", advisorAuthenticateToken, approveInvoiceController);
router.put("/reject-invoice", advisorAuthenticateToken, rejectionInvoiceController);

module.exports = router;
