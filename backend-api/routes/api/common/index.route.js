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

module.exports = router;
