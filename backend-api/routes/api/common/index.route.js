const express = require("express");
const {
    getStateController,
    addStateController,
    activeInactiveStateController,
    getCityController,
    addCityController,
    activeInactiveCityController,
    getStateWithCityController,
    upsertCityController,
    deleteCityController,
    updateStateController,
    deleteStateController,
} = require("../../../presentation/controller/common/common.controller");
const { getTermAndConditionController,
updateTermAndConditionController,
getHelpCenterController,
updateHelpCenterController } = require("../../../presentation/controller/common/commonConfig.controller");

const router = express.Router();

//* State Route
router.get("/get-state", getStateController);
router.get("/get-state-with-city", getStateWithCityController);
router.post("/add-state", addStateController);
router.put("/active-inactive-state", activeInactiveStateController);
router.put("/update-state", updateStateController);
router.delete("/delete-state", deleteStateController);

//* State Route
router.get("/get-city-by-state/:id", getCityController);
router.post("/add-city", addCityController);
router.put("/active-inactive-city", activeInactiveCityController);
router.put("/upsert-city", upsertCityController);
router.delete("/delete-city", deleteCityController);

router.get("/get-term-and-condition", getTermAndConditionController);
router.put("/update-term-and-condition", updateTermAndConditionController);
router.get("/get-help-center", getHelpCenterController);
router.put("/update-help-center", updateHelpCenterController);

module.exports = router;
