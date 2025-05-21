const CommonConfigDatabase = require("../../../infrastructure/databases/config/common_config.database");

class CommonConfigService {
    /**
     * Constructor for initializing the CommonConfigService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.commonConfigDatabase = new CommonConfigDatabase(supabaseInstance);
    }

    async getTermAndConditionService() {
        return await this.commonConfigDatabase.getTermAndConditionDatabase();
    }

    async updateTermAndConditionService(content) {
        return await this.commonConfigDatabase.updateTermAndConditionDatabase(content);
    }

    async getHelpCenterService() {
        return await this.commonConfigDatabase.getHelpCenterDatabase();
    }

    async updateHelpCenterService(title, description, contact_number) {
        return await this.commonConfigDatabase.updateHelpCenterDatabase(
            title,
            description,
            contact_number,
        );
    }
}

module.exports = CommonConfigService;
