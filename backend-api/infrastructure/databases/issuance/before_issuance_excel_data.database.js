const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "before_issuance_excel_data";

class RegionDatabase {

    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

}

module.exports = RegionDatabase;
