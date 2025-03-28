const RegionDatabase = require("../../../infrastructure/databases/region/region.database");

class RegionService {
    constructor(supabaseInstance) {
        this.regionDatabase = new RegionDatabase(supabaseInstance);
    }

    async addRegion(title, state, city) {
        try {
            // Insert into region table
            const region = await this.regionDatabase.createRegion(title);

            // Insert into region_state table
            await this.regionDatabase.createRegionStates(region.region_id, state);

            // Insert into region_city table
            await this.regionDatabase.createRegionCities(region.region_id, city);

            return {
                region_id: region.region_id,
                title,
                state,
                city,
            };
        } catch (error) {
            console.error("Error in addRegion:", error);
            throw new Error(`Failed to add region: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getRegionListByCompanyId(company_id, pageNumber, limit, search) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, total_count } = await this.regionDatabase.getRegionsWithPagination(
                company_id,
                offset,
                limit,
                search,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                total_count,
                total_pages,
            };
        } catch (error) {
            console.error("Error in getRegionListByCompanyId:", error);
            throw new Error(
                `Failed to fetch region list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = RegionService;
