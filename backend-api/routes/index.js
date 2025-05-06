var express = require("express");
var router = express.Router();
var apiRouter = require("./api/index.route");
var viewRouter = require("./view/index.route");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-doc/swagger.json");

router.use("/api", apiRouter);
router.use("/view", viewRouter);
router.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

router.get("/", function (req, res, next) {
    // #swagger.ignore = true
    res.render("index", { title: "Insurance Backend API's" });
});

router.get("/application", function (req, res, next) {
    // #swagger.ignore = true
    res.render("application", { title: "Insurance Backend API's" });
});

router.get("/health-check", function (req, res, next) {
    // #swagger.tags = ['System']
    const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: new Date().toLocaleString(),
    };
    res.status(200).json({ message: "Healthy", healthcheck });
});

module.exports = router;
