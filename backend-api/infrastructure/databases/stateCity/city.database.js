const tableName = "city";
const { SupabaseClient } = require("@supabase/supabase-js");

class CityDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getCityByStateIdDatabase(state_id) {
        try {
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .eq("state_id", state_id);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch Cities: ${error.message}`);
        }
    }

    async addCityDatabase(title, state_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({ title, state_id })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to add City: ${error.message}`);
        }
    }

    async activeInactiveCityDatabase(id, is_active) {
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

    async upsertCityDatabase(city_array) {
        try {
            console.log(city_array);
            const { data, error } = await this.db
                .from(tableName)
                .upsert(city_array, { onConflict: "id", defaultToNull: false })
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to upsert state: ${error.message}`);
        }
    }

    async deleteCityDatabase(id) {
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
            throw new Error(`Failed to delete state: ${error.message}`);
        }
    }
}

module.exports = CityDatabase;
