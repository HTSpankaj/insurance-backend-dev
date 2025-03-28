const tableName = "roles";
const { SupabaseClient } = require("@supabase/supabase-js");

class RolesDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }
    async createRole(title, access) {
        try {
            // Validate that access is an object (for JSONB)
            if (typeof access !== "object" || access === null) {
                throw new Error("Access must be a valid JSON object");
            }

            const { data, error } = await this.db
                .from(tableName)
                .insert({ title, access }) // Supabase will automatically convert object to JSONB
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create role: ${error.message}`);
        }
    }

    async getRoles(pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch roles: ${error.message}`);
        }
    }
}

module.exports = RolesDatabase;
