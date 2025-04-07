const AdvisorAccessDatabase = require("../../../infrastructure/databases/config/advisorAccess.database");

class AdvisorAccessService {
    /**
     * Constructor for initializing the AdvisorAccessService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.advisorAccessDatabase = new AdvisorAccessDatabase(supabaseInstance);
    }

    async getAdvisorAccessService() {
        return await this.advisorAccessDatabase.getAdvisorAccessDatabase();
    }

    async updateAdvisorAccessDatabase(id, access) {
        return await this.advisorAccessDatabase.updateAdvisorAccessDatabase(id, access);
    }
}

module.exports = AdvisorAccessService;
