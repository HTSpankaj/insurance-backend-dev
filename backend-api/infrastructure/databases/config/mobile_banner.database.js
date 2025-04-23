const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "mobile_banner";

class MobileBannerDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getMobileBannerDatabase(is_active) {
        try {
            let query = this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .eq("is_delete", false);

            if (is_active) {
                query = query.eq("is_active", is_active);
            }

            const { data, error, count } = await query;

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to get mobile banner: ${error.message}`);
        }
    }

    async insertMobileBannerDatabase(title, description, is_active) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({ title, description, is_active })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to insert mobile banner: ${error.message}`);
        }
    }

    async updateMobileBannerDatabase(id, title, description, is_active, url) {
        try {
            const postBody = {};
            if (title) postBody.title = title;
            if (description) postBody.description = description;
            if (is_active === true || is_active === false) postBody.is_active = is_active;
            if (url) postBody.url = url;

            const { data, error } = await this.db
                .from(tableName)
                .update(postBody)
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update mobile banner: ${error.message}`);
        }
    }

    async deleteMobileBannerDatabase(id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_delete: true })
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to delete mobile banner: ${error.message}`);
        }
    }
}

module.exports = MobileBannerDatabase;
