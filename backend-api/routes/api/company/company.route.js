const express = require("express");
const {
    createCompanyController,
    addRegionController,
} = require("../../../presentation/controller/company/company.controller");
const upload = require("../../../middleware/multer.middleware");
const router = express.Router();

router.post("/create-company", upload, createCompanyController);
router.post("/add-region", addRegionController);

module.exports = router;
