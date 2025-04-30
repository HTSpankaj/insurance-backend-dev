const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "after_issuance_transaction";

class AfterIssuanceTransactionDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addAfterIssuanceTransactionDatabase(
        lead_product_relation_id,
        commission_amount,
        payout_type,
        actual_number_transaction,
        commission_start_date,
        commission_end_date,
        after_issuance_excel_data_id,
    ) {
        const { data, error } = await this.db
            .from(tableName)
            .insert({
                lead_product_relation_id,
                commission_amount,
                payout_type,
                actual_number_transaction,
                commission_start_date,
                commission_end_date,
                after_issuance_excel_data_id,
            })
            .select("*")
            .maybeSingle();
        if (data) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error,
            };
        }
    }

    async getAfterIssuanceTransactionDatabase() {
        const { data, error } = await this.db.rpc(
            "get_after_issuance_transactions_for_invoice_creation",
        );
        return {
            data,
            error,
        };
    }

    async updateAfterIssuanceTransactionDatabase(
        current_number_invoice_created,
        after_issuance_transaction_id,
    ) {
        const { data, error } = await this.db
            .from(tableName)
            .update({
                current_number_invoice_created,
            })
            .eq("id", after_issuance_transaction_id)
            .select("*")
            .maybeSingle();
        return {
            data,
            error,
        };
    }

    async getRemunerationDashboardCardStatisticsDatabase() {
        try {
            const { data, error } = await this.db.rpc("get_remuneration_dashboard_card_statistics");
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get remuneration dashboard card statistics: ${error.message}`,
            );
        }
    }
    async getRemunerationInvoiceCardStatisticsDatabase(start_date, end_date) {
        try {
            const { data, error } = await this.db.rpc("get_remuneration_invoice_card_statistics", {
                start_date_val: start_date || null,
                end_date_val: end_date || null,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get remuneration dashboard card statistics: ${error.message}`,
            );
        }
    }
    async getRemunerationInvoiceListForAdminDatabase(start_date, end_date) {
        try {
            const { data, error } = await this.db.rpc("get_remuneration_invoice_list", {
                start_date_val: start_date || null,
                end_date_val: end_date || null,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get remuneration invoice list: ${error.message}`);
        }
    }
    async getRemunerationDashboardEarningBarStatisticsDatabase(company_id) {
        try {
            const { data, error } = await this.db.rpc(
                "get_remuneration_dashboard_earning_bar_statistics",
                {
                    company_id_val: company_id,
                },
            );
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get remuneration dashboard card statistics: ${error.message}`,
            );
        }
    }

    async getRemunerationCompaniesWithFinancialStatisticsDatabase(search, page_number, limit) {
        try {
            const offset = (page_number - 1) * limit;
            const { data, error } = await this.db.rpc("get_companies_with_financial_statistics", {
                search_val: search || null,
                offset_val: offset || 0,
                limit_val: limit || 10,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get Remuneration Companies with Financial Statistics: ${error.message}`,
            );
        }
    }
}

module.exports = AfterIssuanceTransactionDatabase;
