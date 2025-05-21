const RegionDatabase = require("../../../infrastructure/databases/region/region.database");

class RegionService {
    constructor(supabaseInstance) {
        this.regionDatabase = new RegionDatabase(supabaseInstance);
    }

    async addRegion(title, state, city, company_id) {
        try {
            // Insert into region table
            const region = await this.regionDatabase.createRegion(title, company_id);

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
    async checkRegion(title, state, city = [], company_id, region_id) {
        try {
            let messageObj = {};
            const region = await this.regionDatabase.checkRegion(title, company_id, region_id);
            if (region?.length > 0) {
                if (
                    region?.some(
                        s =>
                            s?.title?.toLowerCase() === title?.toLowerCase() &&
                            s?.region_id !== region_id,
                    )
                ) {
                    messageObj.title = "Region title already exists";
                }
            }

            if (city?.length > 0) {
                let cityName = [];

                region.forEach(regionElement => {
                    regionElement?.city?.forEach(_serverCity => {
                        if (
                            city.includes(_serverCity.city_id.id) &&
                            _serverCity?.region_id !== region_id &&
                            !cityName.includes(_serverCity.city_id.title)
                        ) {
                            cityName.push(_serverCity.city_id.title);
                        }
                    });
                });
                if (cityName?.length > 0) {
                    messageObj.city = `City ${cityName?.join(", ")} already exists`;
                }
            }

            return messageObj;
            // return region
        } catch (error) {
            console.error("Error in addRegion:", error);
            throw new Error(`Failed to add region: ${error.message || JSON.stringify(error)}`);
        }
    }
    async updateRegion(region_id, title, state, city, company_id) {
        try {
            // Insert into region table
            const region = await this.regionDatabase.updateRegion(region_id, title, company_id);

            // Insert into region_state table
            await this.regionDatabase.updateRegionStates(region.region_id, state);

            // Insert into region_city table
            await this.regionDatabase.updateRegionCities(region.region_id, city);

            return {
                region_id: region.region_id,
                title,
                state,
                city,
            };
        } catch (error) {
            console.error("Error in  updateRegion:", error);
            throw new Error(`Failed to update region: ${error.message || JSON.stringify(error)}`);
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

    async deleteRegion(region_id) {
        return await this.regionDatabase.deleteRegion(region_id);
    }
}

module.exports = RegionService;
