// presentation/routes/subscription/subscription.route.js

const express = require("express");
const {
    createSubscriptionController,
    getSubscriptionListController,
    getSubscriptionDetailsByIdController,
} = require("../../../presentation/controller/subscription/subscription.controller");
const { authenticateToken } = require("../../../middleware/auth");
// You might want to create a validator file similar to the advisor's
// const { subscriptionValidator } = require("../../../validator/subscription/subscription.validator");

const router = express.Router();

// @route   POST api/subscription
// @desc    Add a new subscription plan
// @access  Private (Admin)
router.post(
    "/subscription",
    // subscriptionValidator, // Add validation middleware if needed
    authenticateToken,
    createSubscriptionController,
);

// @route   GET api/subscriptions
// @desc    Get all subscription plans with pagination
// @access  Private (Admin)
router.get("/subscriptions", authenticateToken, getSubscriptionListController);

// @route   GET api/subscription/:id
// @desc    Get a single subscription by ID
// @access  Private (Admin)
router.get("/subscription/:id", authenticateToken, getSubscriptionDetailsByIdController);

module.exports = router;
