const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "after_issuance_excel_data";

class AfterIssuanceExcelDataDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addAfterIssuanceExcelDataDatabase(payload) {
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

    async deleteAfterIssuanceExcelDataDatabase(id) {
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
}

module.exports = AfterIssuanceExcelDataDatabase;
