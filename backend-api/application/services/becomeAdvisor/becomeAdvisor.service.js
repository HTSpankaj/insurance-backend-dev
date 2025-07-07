const BecomeAdvisorDatabase = require("../../../infrastructure/databases/becomeAdvisor/becomeAdvisor.database");

class BecomeAdvisorService {
    constructor(supabaseInstance) {
        this.becomeAdvisorDatabase = new BecomeAdvisorDatabase(supabaseInstance);
    }

    async addBecomeAdvisorService(name, email, contact_number) {
        return await this.becomeAdvisorDatabase.addBecomeAdvisorDatabase(
            name,
            email,
            contact_number,
        );
    }
    async addHtsContactFormService(name, email, contact_number, message) {
        return await this.becomeAdvisorDatabase.addHtsContactFormDatabase(
            name,
            email,
            contact_number,
            message,
        );
    }

    async getBecomeAdvisorService(page_number, limit) {
        try {
            const { data, total } = await this.becomeAdvisorDatabase.getBecomeAdvisorDatabase(
                page_number,
                limit,
            );
            return {
                success: true,
                data,
                metadata: {
                    total_count: total,
                    page: page_number,
                    per_page: limit,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }
}

module.exports = BecomeAdvisorService;
