const express = require("express");
const router = express.Router();

// Import all required route modules
const invoiceRouter = require("./invoice.route");


router.use("/invoice", invoiceRouter);

module.exports = router;
