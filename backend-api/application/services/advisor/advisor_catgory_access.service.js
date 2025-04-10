const AdvisorCategoryAccessDatabase = require("../../../infrastructure/databases/advisor/advisor_catgory_access.database");

class AdvisorCategoryAccessService {
    constructor(supabaseInstance) {
        this.advisorCategoryAccessDatabase = new AdvisorCategoryAccessDatabase(supabaseInstance);
    }

    async getAdvisorCategoryAccessService(advisor_id) {
        const advisorCategoryAccess =
            await this.advisorCategoryAccessDatabase.getAdvisorCategoryAccessDatabase(advisor_id);
        return advisorCategoryAccess;
    }

    async upsertAdvisorCategoryAccessService(advisor_category_access_array) {
        const advisorCategoryAccess =
            await this.advisorCategoryAccessDatabase.upsertAdvisorCategoryAccessDatabase(
                advisor_category_access_array,
            );
        return advisorCategoryAccess;
    }
}

module.exports = AdvisorCategoryAccessService;
