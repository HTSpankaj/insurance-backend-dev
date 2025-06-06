const express = require("express");
const {
    addRegionController,
    checkRegionController,
    getRegionListByCompanyIdController,
    updateRegionController,
    deleteRegionController,
} = require("../../../presentation/controller/region/region.controller");
const router = express.Router();

router.post("/add-region", addRegionController);
router.post("/check-region", checkRegionController);
router.put("/update-region", updateRegionController);
router.get("/get-region-list-by-company-id/:id", getRegionListByCompanyIdController);
router.delete("/delete-region/:region_id", deleteRegionController);

module.exports = router;
