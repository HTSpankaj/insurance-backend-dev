// infrastructure/databases/subscription/subscription.database.js

const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "subscription";

class SubscriptionDatabase {
    /**
     * @param {SupabaseClient} supabaseInstance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    /**
     * Creates a new subscription plan in the database.
     * @param {object} subscriptionData - The data for the new subscription.
     * @returns {Promise<object>} The created subscription data.
     */
    async createSubscription(subscriptionData) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert(subscriptionData)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createSubscription:", error);
                throw error;
            }

            return data;
        } catch (error) {
            throw new Error(`Failed to create subscription: ${error.message}`);
        }
    }

    /**
     * Retrieves a paginated list of subscriptions.
     * @param {number} page - The current page number.
     * @param {number} perPage - The number of items per page.
     * @returns {Promise<{subscriptions: object[], totalCount: number}>} The list of subscriptions and the total count.
     */
    async getSubscriptionsWithPagination(page, perPage) {
        try {
            const from = (page - 1) * perPage;
            const to = from + perPage - 1;

            let query = this.db.from(tableName).select("*", { count: "exact" });

            // Order by creation date, newest first
            query = query.order("created_at", { ascending: false });

            // Get paginated data
            const { data, error, count } = await query.range(from, to);

            if (error) {
                console.error("Supabase error in getSubscriptionsWithPagination:", error);
                throw error;
            }

            return { subscriptions: data || [], totalCount: count || 0 };
        } catch (error) {
            throw new Error(`Failed to fetch subscriptions: ${error.message}`);
        }
    }

    /**
     * Retrieves a single subscription by its ID.
     * @param {string} subscriptionId - The UUID of the subscription.
     * @returns {Promise<object|null>} The subscription data or null if not found.
     */
    async getSubscriptionById(subscriptionId) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select("*")
                .eq("id", subscriptionId)
                .maybeSingle();

            if (error) {
                console.error("Supabase error in getSubscriptionById:", error);
                throw error;
            }

            return data;
        } catch (error) {
            throw new Error(`Failed to fetch subscription by ID: ${error.message}`);
        }
    }
}

module.exports = SubscriptionDatabase;
