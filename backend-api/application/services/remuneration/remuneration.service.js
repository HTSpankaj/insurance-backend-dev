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

    async getRemunerationDashboardEarningBarStatisticsService(company_id) {
        return await this.afterIssuanceTransactionDatabase.getRemunerationDashboardEarningBarStatisticsDatabase(
            company_id,
        );
    }

    async getRemunerationCompaniesWithFinancialStatisticsService(search, page_number, limit) {
        return await this.afterIssuanceTransactionDatabase.getRemunerationCompaniesWithFinancialStatisticsDatabase(
            search,
            page_number,
            limit,
        );
    }
}

module.exports = RemunerationService;
