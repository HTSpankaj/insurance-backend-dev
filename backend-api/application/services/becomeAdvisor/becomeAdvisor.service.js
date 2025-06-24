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

    async getBecomeAdvisorService() {
        return await this.becomeAdvisorDatabase.getBecomeAdvisorDatabase();
    }
}

module.exports = BecomeAdvisorService;
