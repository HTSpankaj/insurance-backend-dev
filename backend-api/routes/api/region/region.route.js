const express = require("express");
const {
    addRegionController,
    getRegionListByCompanyIdController,
} = require("../../../presentation/controller/region/region.controller");
const router = express.Router();

router.post("/add-region", addRegionController);
router.get("/get-region-list-by-company-id/:id", getRegionListByCompanyIdController);

module.exports = router;
