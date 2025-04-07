const express = require("express");
const {
    createUserController,
    getUsersController,
    updateUserController,
    deleteUserController,
} = require("../../../presentation/controller/users/users.controller");
const { loginValidateInput } = require("../../../validator/users/users.validator");
const router = express.Router();

router.post("/", loginValidateInput, createUserController);
router.get("/", getUsersController);
router.put("/:user_id", updateUserController);
router.delete("/:user_id", deleteUserController);

module.exports = router;
