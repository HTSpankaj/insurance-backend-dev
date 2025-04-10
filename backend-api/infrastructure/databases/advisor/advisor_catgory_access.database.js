const tableName = "advisor_category_access";
const { SupabaseClient } = require("@supabase/supabase-js");

class AdvisorCategoryAccessDatabase {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async upsertAdvisorCategoryAccessDatabase(advisor_category_access_array) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .upsert(advisor_category_access_array, { onConflict: "category_id, advisor_id" })
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to upsert advisor_category_access: ${error.message}`);
        }
    }

    async getAdvisorCategoryAccessDatabase(advisor_id) {
        try {
            const { data, error, count } = await this.db
                .from(tableName)
                .select("category_id(category_id,title),is_access, advisor_id", {
                    count: "exact",
                })
                .eq("advisor_id", advisor_id);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to get advisor_category_access: ${error.message}`);
        }
    }
}

module.exports = AdvisorCategoryAccessDatabase;
