const express = require("express");
const router = express.Router();

const advisorAccessConfigRoute = require("./advisorAccessConfig.route");

router.use("/advisor-access", advisorAccessConfigRoute);

module.exports = router;
