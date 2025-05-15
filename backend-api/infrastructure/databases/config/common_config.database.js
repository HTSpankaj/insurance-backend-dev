const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "common_config";

const termAndConditionId = "5e1a6052-bedb-4029-a011-f079ba803f58";
const helpCenterId = "68a5b70d-1283-4555-916f-287bcc036550";
class CommonConfigDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getTermAndConditionDatabase() {
        try {
            const { data, error } = await this.db.from(tableName).select("*").eq("id", termAndConditionId).maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get term and condition: ${error.message}`);
        }
    }

    async updateTermAndConditionDatabase(content) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ config: {content} })
                .eq("id", termAndConditionId)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update term and condition: ${error.message}`);
        }
    }

    async getHelpCenterDatabase() {
        try {
            const { data, error } = await this.db.from(tableName).select("*").eq("id", helpCenterId).maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get help center: ${error.message}`);
        }
    }

    async updateHelpCenterDatabase(title,
description,
contact_number) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ config: {title,
description,
contact_number} })
                .eq("id", helpCenterId)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update help center: ${error.message}`);
        }
    }
}

module.exports = CommonConfigDatabase;
