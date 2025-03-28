const express = require("express");
const {
    createUserController,
    getUsersController,
} = require("../../../presentation/controller/users/users.controller");
const { loginValidateInput } = require("../../../middleware/validation.middleware"); // Assuming you have this middleware
const router = express.Router();

router.post("/", loginValidateInput, createUserController);
router.get("/", getUsersController);

module.exports = router;
