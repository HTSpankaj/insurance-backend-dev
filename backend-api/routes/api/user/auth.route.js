const express = require("express");
const router = express.Router();

const { loginValidateInput } = require("../../../validator/users/auth.validator");
const {
    logInUser,
    refresh,
    logOutUser,
} = require("../../../presentation/controller/users/auth.controller");

const { authenticateToken } = require("../../../middleware/auth");

router.post("/login", loginValidateInput, logInUser);
router.post("/refresh", authenticateToken, refresh);

// router.post("/relationship-manager-login", loginValidateInput, logInUser);
// router.post("/relationship-manager-refresh", authenticateToken, refresh);
// router.post("/logout", authenticateToken, logOutUser);

module.exports = router;
