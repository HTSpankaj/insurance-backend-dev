const express = require("express");
const { getAllInvoiceSchedularConfigController, InsertInvoiceSchedularConfigController, UpdateInvoiceSchedularConfigController, DeleteInvoiceSchedularConfigController } = require("../../../presentation/controller/config/InvoiceSchedulerConfig.controller");


const router = express.Router();

router.get("/get-config", getAllInvoiceSchedularConfigController);
router.post("/insert-config", InsertInvoiceSchedularConfigController);
router.put("/update-config", UpdateInvoiceSchedularConfigController);
router.delete("/delete-config", DeleteInvoiceSchedularConfigController);

module.exports = router;
