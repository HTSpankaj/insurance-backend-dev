const { SupabaseClient } = require("@supabase/supabase-js");
const CityDatabase = require("../../../infrastructure/databases/stateCity/city.database");

class CityService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.cityDatabase = new CityDatabase(supabaseInstance);
    }

    async getCityByStateIdService(state_id) {
        const city = await this.cityDatabase.getCityByStateIdDatabase(state_id);
        return city;
    }

    async addCityService(title, state_id) {
        const city = await this.cityDatabase.addCityDatabase(title, state_id);
        return city;
    }

    async activeInactiveCityService(id, is_active) {
        const city = await this.cityDatabase.activeInactiveCityDatabase(id, is_active);
        return city;
    }

    async upsertCityService(city_array) {
        const city = await this.cityDatabase.upsertCityDatabase(city_array);
        return city;
    }

    async deleteCityService(id) {
        const city = await this.cityDatabase.deleteCityDatabase(id);
        return city;
    }
}

module.exports = CityService;
