const { SupabaseClient } = require("@supabase/supabase-js");
const AdvisorCompanyAccessDatabase = require("../../../infrastructure/databases/advisor/advisor_company_access.database");

class AdvisorCompanyAccessService {
    constructor(supabaseInstance) {
        this.advisorCompanyAccessDatabase = new AdvisorCompanyAccessDatabase(supabaseInstance);
    }

    async getAdvisorCompanyAccessService(advisor_id) {
        const advisorCompanyAccess = await this.advisorCompanyAccessDatabase.getAdvisorCompanyAccessDatabase(advisor_id);
        return advisorCompanyAccess;
    }

    async upsertAdvisorCompanyAccessService(advisor_company_access_array) {
        const advisorCompanyAccess = await this.advisorCompanyAccessDatabase.upsertAdvisorCompanyAccessDatabase(advisor_company_access_array);
        return advisorCompanyAccess;
    }
}

module.exports = AdvisorCompanyAccessService;
