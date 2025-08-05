// application/services/subscription/subscription.service.js

const SubscriptionDatabase = require("../../../infrastructure/databases/subscription/subscription.database");

class SubscriptionService {
    constructor(supabaseInstance) {
        this.subscriptionDatabase = new SubscriptionDatabase(supabaseInstance);
    }

    /**
     * Handles the logic for creating a subscription.
     */
    async createSubscription(
        title,
        description,
        plan_benefits,
        duration,
        price,
        tax_percentage,
        created_by_admin_id,
    ) {
        try {
            // Calculate total price
            const numericPrice = parseFloat(price);
            const numericTax = parseFloat(tax_percentage);
            const total_price = numericPrice + (numericPrice * numericTax) / 100;

            const subscriptionData = {
                title,
                description,
                plan_benefits,
                duration,
                price: numericPrice,
                tax_percentage: numericTax,
                total_price,
                created_by_admin_id,
            };

            return await this.subscriptionDatabase.createSubscription(subscriptionData);
        } catch (error) {
            console.error("Error in createSubscription service:", error);
            throw error; // Re-throw the original error
        }
    }

    /**
     * Handles the logic for getting a list of subscriptions.
     */
    async getSubscriptionList(page, perPage) {
        try {
            const { subscriptions, totalCount } =
                await this.subscriptionDatabase.getSubscriptionsWithPagination(page, perPage);

            const totalPages = Math.ceil(totalCount / perPage);

            return {
                data: subscriptions,
                metadata: {
                    total_count: totalCount,
                    current_page_count: subscriptions.length,
                    page: page,
                    per_page: perPage,
                    total_pages: totalPages,
                },
            };
        } catch (error) {
            console.error("Error in getSubscriptionList service:", error);
            throw error;
        }
    }

    /**
     * Handles the logic for getting subscription details by ID.
     */
    async getSubscriptionDetailsById(subscriptionId) {
        try {
            const subscription =
                await this.subscriptionDatabase.getSubscriptionById(subscriptionId);

            if (!subscription) {
                throw new Error("Subscription not found");
            }
            return subscription;
        } catch (error) {
            console.error("Error in getSubscriptionDetailsById service:", error);
            throw error;
        }
    }
}

module.exports = SubscriptionService;
