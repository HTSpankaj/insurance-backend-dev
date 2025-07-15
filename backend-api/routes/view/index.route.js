const express = require("express");
const router = express.Router();

// Import all required route modules
const invoiceRouter = require("./invoice.route");

router.get("/get-hts-contact-view", (req, res) => {
    res.render("HtsContact/hts-contact");
});

router.use("/invoice", invoiceRouter);

module.exports = router;
