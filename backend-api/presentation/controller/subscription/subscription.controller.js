// presentation/controller/subscription/subscription.controller.js

const { supabaseInstance } = require("../../../supabase-db/index.js");
const SubscriptionService = require("../../../application/services/subscription/subscription.service.js");

const subscriptionService = new SubscriptionService(supabaseInstance);

/**
 * Controller to add a new subscription.
 */
exports.createSubscriptionController = async (req, res) => {
    /*
  #swagger.tags = ['Subscription']
  #swagger.description = 'Add a new subscription plan. Admin access required.'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      title: "Premium Plan",
      description: "Full access to all features.",
      plan_benefits: "Benefit 1, Benefit 2, Benefit 3",
      duration: "Yearly",
      price: 999.00,
      tax_percentage: 18.00
    }
  }
*/
    try {
        const { title, description, plan_benefits, duration, price, tax_percentage } = req.body;
        const created_by_admin_id = res.locals.tokenData?.user_id;

        if (!created_by_admin_id) {
            return res
                .status(403)
                .json({
                    success: false,
                    error: { message: "Unauthorized: Admin ID not found in token." },
                });
        }

        const result = await subscriptionService.createSubscription(
            title,
            description,
            plan_benefits,
            duration,
            price,
            tax_percentage,
            created_by_admin_id,
        );

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully.",
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

/**
 * Controller to get a paginated list of subscriptions.
 */
exports.getSubscriptionListController = async (req, res) => {
    /*
      #swagger.tags = ['Subscription']
      #swagger.description = 'Get a paginated list of all subscription plans.'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1, description: 'Page number' }
      #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10, description: 'Number of records per page' }
    */
    try {
        const page = parseInt(req.query.page || 1, 10);
        const limit = parseInt(req.query.limit || 10, 10);

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            throw new Error("Invalid page or limit parameter.");
        }

        const result = await subscriptionService.getSubscriptionList(page, limit);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

/**
 * Controller to get a single subscription by its ID.
 */
exports.getSubscriptionDetailsByIdController = async (req, res) => {
    /*
      #swagger.tags = ['Subscription']
      #swagger.description = 'Get details of a specific subscription plan by its ID.'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, description: 'Subscription UUID' }
    */
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("Subscription ID is required.");
        }

        const subscription = await subscriptionService.getSubscriptionDetailsById(id);

        return res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.message === "Subscription not found" ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
