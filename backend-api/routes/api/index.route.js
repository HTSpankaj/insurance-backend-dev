const express = require("express");
const router = express.Router();

// Import all required route modules
const authRouter = require("./user/auth.route");
const userRouter = require("./user/index.route"); // Existing user sub-routes
const usersRoute = require("./user/users.route"); // New users route for POST/GET
const rolesRoute = require("./roles.route");
const productRouter = require("./product/product.route");
const relationshipManagerRouter = require("./relationship-manager/relationship-manager.route");
const courseRouter = require("./course/course.route");

// Add the subcategory route import
const categoryRouter = require("./category/category.route");
const subCategoryRouter = require("./sub_category/sub_category.route");
const companyRouter = require("./company/company.route");
const leadRouter = require("./lead/lead.route");
const issuanceRouter = require("./issuance/index.route");

var commonRouter = require("./common/index.route");
const advisorRoute = require("./advisor/advisor.route"); // New advisor route
const regionRouter = require("./region/region.route");

// Import authentication middleware
const { authenticateToken } = require("../../middleware/auth");

// Authentication routes (no token required)
router.use("/user/auth", authRouter);

// User management routes (protected by authentication)
router.use("/user", authenticateToken, userRouter); // Existing user sub-routes
router.use("/users", authenticateToken, usersRoute); // New POST/GET user APIs
router.use("/roles", rolesRoute); // No authentication required (as per your existing setup)
router.use("/region", regionRouter);
// Add the category route definition
router.use("/category", categoryRouter);
router.use("/sub-category", subCategoryRouter);

router.use("/common", commonRouter);

//* Advisor APIs
router.use("/advisor", advisorRoute); // No authentication required for advisor APIs

//* Company, Region and Lead APIs
router.use("/company", companyRouter);
router.use("/lead", leadRouter);
router.use("/product", productRouter);
router.use("/relationship-manager", relationshipManagerRouter);

router.use("/course", courseRouter);

router.use("/issuance", authenticateToken, issuanceRouter);

module.exports = router;
