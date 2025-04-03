const express = require("express");
const {
    createCompanyController,
    addRegionController,
    getCompanyListController,
    getConvertedLeadsByCompanyIdController,
    getCompanyDetailsByIdWithStatisticsController,
} = require("../../../presentation/controller/company/company.controller");
const upload = require("../../../middleware/multer.middleware");
const router = express.Router();

router.post("/create-company", upload, createCompanyController);
router.post("/add-region", addRegionController);
router.get("/company-list", getCompanyListController);
router.get("/get-converted-lead-list-by-company-id/:id", getConvertedLeadsByCompanyIdController);
router.get(
    "/company-details-by-id-with-statistics/:id",
    getCompanyDetailsByIdWithStatisticsController,
);
module.exports = router;
