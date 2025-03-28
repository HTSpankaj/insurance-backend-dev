const tableName = "state";
const { SupabaseClient } = require("@supabase/supabase-js");

class StateDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getStateDatabase() {
        try {
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*", { count: "exact" });

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch sates: ${error.message}`);
        }
    }

    async getStateWithCityDatabase() {
        try {
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*, city(*)", { count: "exact" });

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch sates: ${error.message}`);
        }
    }

    async addStateDatabase(title) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({ title })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to add state: ${error.message}`);
        }
    }

    async activeInactiveStateDatabase(id, is_active) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_active })
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update state: ${error.message}`);
        }
    }
}

module.exports = StateDatabase;
