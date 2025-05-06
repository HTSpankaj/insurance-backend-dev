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

    async getRemunerationInvoiceCardStatisticsService(start_date, end_date) {
        return await this.afterIssuanceTransactionDatabase.getRemunerationInvoiceCardStatisticsDatabase(
            start_date,
            end_date,
        );
    }
    async getRemunerationInvoiceListForAdminService(start_date, end_date) {
        return await this.afterIssuanceTransactionDatabase.getRemunerationInvoiceListForAdminDatabase(
            start_date,
            end_date,
        );
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

    async getRemunerationPaymentListService(search, page_number, limit, start_date, end_date) {
        return await this.afterIssuanceTransactionDatabase.getRemunerationPaymentListDatabase(
            search,
            page_number,
            limit,
            start_date,
            end_date,
        );
    }
}

module.exports = RemunerationService;
