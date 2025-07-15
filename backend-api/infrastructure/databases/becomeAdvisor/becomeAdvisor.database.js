const tableName = "become_advisor";
const htsTableName = "hts_contact";
const { SupabaseClient } = require("@supabase/supabase-js");

class BecomeAdvisorDatabase {
    /**
     * Constructor for initializing the BecomeAdvisorDatabase
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addBecomeAdvisorDatabase(name, email, contact_number) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({ name, email, contact_number }) // Include description
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to add become advisor: ${error.message}`);
        }
    }
    async addHtsContactFormDatabase(name, email, contact_number, message) {
        try {
            const { data, error } = await this.db
                .from(htsTableName)
                .insert({ name, email, contact_number, message }) // Include description
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to add hts contact form: ${error.message}`);
        }
    }

    async getHtsContactDatabase() {
        try {
            const { data, error } = await this.db.from(htsTableName).select("*");
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get hts contact form: ${error.message}`);
        }
    }

    async getBecomeAdvisorDatabase(page_number, limit) {
        try {
            const offset = (page_number - 1) * limit;
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .range(offset, offset + limit - 1);
            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to get become advisor: ${error.message}`);
        }
    }
}

module.exports = BecomeAdvisorDatabase;
