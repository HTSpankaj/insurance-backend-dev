const express = require("express");
const { advisorUpdateConfigValidator } = require("../../../validator/config/config.validator");
const {
    updateAdvisorAccessConfigController,
    getAdvisorAccessConfigController,
} = require("../../../presentation/controller/config/advisorAccessConfig.controller");

const router = express.Router();

router.put("/update-config", advisorUpdateConfigValidator, updateAdvisorAccessConfigController);
router.get("/get-config", getAdvisorAccessConfigController);

module.exports = router;
