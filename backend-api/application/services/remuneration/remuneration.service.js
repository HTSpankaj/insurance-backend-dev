const AfterIssuanceTransactionDatabase = require("../../../infrastructure/databases/issuance/after_issuance_transaction.database");

class RemunerationService {
    constructor(supabaseInstance) {
        this.afterIssuanceTransactionDatabase = new AfterIssuanceTransactionDatabase(
            supabaseInstance,
        );
    }

    async getRemunerationDashboardCardStatisticsService() {
        return await this.afterIssuanceTransactionDatabase.getRemunerationDashboardCardStatisticsDatabase();
    }
}

module.exports = RemunerationService;
