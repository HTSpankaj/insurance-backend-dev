const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "before_issuance_excel_data";

class BeforeIssuanceExcelDataDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addBeforeIssuanceExcelDataDatabase(payload) {
        const { data, error } = await this.db
            .from(tableName)
            .insert(payload)
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

    async deleteBeforeIssuanceExcelDataDatabase(id) {
        const { error } = await this.db.from(tableName).delete().eq("id", id);
        if (error) {
            return {
                success: false,
                error,
            };
        } else {
            return {
                success: true,
            };
        }
    }

    async getExcelDataForAfterIssuanceDatabase(page_number, limit) {
        try {
            const { data, error } = await this.db.rpc(
                "get_excel_data_for_after_issuance_excel",
                { page_number_val: page_number, limit_val: limit },
            );
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get excel data for after issuance excel: ${error.message}`,
            );
        }
    }
}

module.exports = BeforeIssuanceExcelDataDatabase;
