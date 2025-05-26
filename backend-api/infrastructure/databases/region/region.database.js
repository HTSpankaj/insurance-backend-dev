const regionTableName = "region";
const regionStateTableName = "region_state";
const regionCityTableName = "region_city";
const { SupabaseClient } = require("@supabase/supabase-js");

class RegionDatabase {
    /**
     * Constructor for initializing the CategoryDatabase
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createRegion(title, company_id) {
        try {
            const { data, error } = await this.db
                .from(regionTableName)
                .insert({ title, company_id })
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
    async checkRegion(title, company_id, region_id) {
        try {
            let query = this.db
                .from(regionTableName)
                .select("*, state:region_state(*, state_id(*)), city:region_city(*, city_id(*))")
                .eq("company_id", company_id)
                .eq("is_delete", false);

            const { data, error } = await query;

            if (error) {
                console.error("Supabase error in checkRegion:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRegion:", error);
            throw new Error(`Failed to create region: ${error.message || JSON.stringify(error)}`);
        }
    }
    async updateRegion(region_id, title, company_id) {
        try {
            const { data, error } = await this.db
                .from(regionTableName)
                .update({ title })
                .eq("region_id", region_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateRegion:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRegion:", error);
            throw new Error(`Failed to update region: ${error.message || JSON.stringify(error)}`);
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

    async updateRegionStates(region_id, state) {
        try {
            const regionStates = state.map(state_id => ({
                region_id,
                state_id,
            }));

            await this.db.from(regionStateTableName).delete().eq("region_id", region_id);

            const { data, error } = await this.db
                .from(regionStateTableName)
                .insert(regionStates)
                .select();

            if (error) {
                console.error("Supabase error in updateRegionStates:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRegionStates:", error);
            throw new Error(
                `Failed to update region states: ${error.message || JSON.stringify(error)}`,
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
    async updateRegionCities(region_id, city) {
        try {
            const regionCities = city.map(city_id => ({
                region_id,
                city_id,
            }));

            await this.db.from(regionCityTableName).delete().eq("region_id", region_id);

            const { data, error } = await this.db
                .from(regionCityTableName)
                .insert(regionCities)
                .select();

            if (error) {
                console.error("Supabase error in updateRegionCities:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRegionCities:", error);
            throw new Error(
                `Failed to update region cities: ${error.message || JSON.stringify(error)}`,
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
                        state_id(title, id)
                    ),
                    region_city!region_id (
                        city_id(title, id)
                    )
                `,
                    { count: "exact" },
                )
                .eq("company_id", company_id)
                .eq("is_delete", false);

            // Apply search filter
            if (search) {
                query = query.ilike("title", `%${search}%`);
            }

            // Apply pagination
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            let { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getRegionsWithPagination:", error);
                throw error;
            }
            if (data) {
                data = data.map(region => {
                    return {
                        ...region,
                        region_state: region.region_state.map(state => state.state_id),
                        region_city: region.region_city.map(city => city.city_id),
                    };
                });
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

    async deleteRegion(region_id) {
        try {
            const { error, data } = await this.db
                .from(regionTableName)
                .update({ is_delete: true })
                .select()
                .eq("region_id", region_id)
                .maybeSingle();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in deleteRegion:", error);
            throw new Error(`Failed to delete region: ${error.message || JSON.stringify(error)}`);
        }
    }
}

module.exports = RegionDatabase;
