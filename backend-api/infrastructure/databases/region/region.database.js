const regionTableName = "region";
const regionStateTableName = "region_state";
const regionCityTableName = "region_city";
const { SupabaseClient } = require("@supabase/supabase-js");

class RegionDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createRegion(title) {
        try {
            const { data, error } = await this.db
                .from(regionTableName)
                .insert({ title })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createRegion:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRegion:", error);
            throw new Error(`Failed to create region: ${error.message || JSON.stringify(error)}`);
        }
    }

    async createRegionStates(region_id, state) {
        try {
            const regionStates = state.map(state_id => ({
                region_id,
                state_id,
            }));

            const { data, error } = await this.db
                .from(regionStateTableName)
                .insert(regionStates)
                .select();

            if (error) {
                console.error("Supabase error in createRegionStates:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRegionStates:", error);
            throw new Error(
                `Failed to insert region states: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async createRegionCities(region_id, city) {
        try {
            const regionCities = city.map(city_id => ({
                region_id,
                city_id,
            }));

            const { data, error } = await this.db
                .from(regionCityTableName)
                .insert(regionCities)
                .select();

            if (error) {
                console.error("Supabase error in createRegionCities:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRegionCities:", error);
            throw new Error(
                `Failed to insert region cities: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getRegionsWithPagination(company_id, offset, limit, search) {
        try {
            // Build the query
            let query = this.db
                .from(regionTableName)
                .select(
                    `
                    *,
                    region_state!region_id (
                        state_id
                    ),
                    region_city!region_id (
                        city_id
                    )
                `,
                    { count: "exact" },
                )
                .eq("company_id", company_id);

            // Apply search filter
            if (search) {
                query = query.ilike("name", `%${search}%`);
            }

            // Apply pagination
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getRegionsWithPagination:", error);
                throw error;
            }

            return {
                data: data || [],
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getRegionsWithPagination:", error);
            throw new Error(`Failed to fetch regions: ${error.message || JSON.stringify(error)}`);
        }
    }
}

module.exports = RegionDatabase;
