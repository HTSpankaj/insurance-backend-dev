const { SupabaseClient } = require("@supabase/supabase-js");

const courseTableName = "advisor_access";

class AdvisorAccessDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getAdvisorAccessDatabase() {
        try {
            const { data, error, count } = await this.db
                .from(courseTableName)
                .select("*", { count: "exact" });

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to get advisor config access: ${error.message}`);
        }
    }

    async updateAdvisorAccessDatabase(id, access) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .update({
                    access,
                })
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("Advisor config access not found");

            return data;
        } catch (error) {
            throw new Error(
                `Failed to update advisor config access: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = AdvisorAccessDatabase;
