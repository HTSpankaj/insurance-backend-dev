const express = require("express");
const {
    insertMobileBannerValidator,
    updateMobileBannerValidator,
} = require("../../../validator/config/mobileBanner.validator");
const {
    insertMobileBannerController,
    updateMobileBannerController,
    getMobileBannerController,
    deleteMobileBannerController,
} = require("../../../presentation/controller/config/mobileBannerConfig.controller");
const { authenticateToken } = require("../../../middleware/auth");
const { mobileBannerMulter } = require("../../../middleware/config.middleware");

const router = express.Router();

router.get("/get-config", getMobileBannerController);
router.post(
    "/insert-config",
    authenticateToken,
    mobileBannerMulter,
    insertMobileBannerValidator,
    insertMobileBannerController,
);
router.put(
    "/update-config",
    authenticateToken,
    mobileBannerMulter,
    updateMobileBannerValidator,
    updateMobileBannerController,
);
router.delete("/delete-config/:id", authenticateToken, deleteMobileBannerController);

module.exports = router;
