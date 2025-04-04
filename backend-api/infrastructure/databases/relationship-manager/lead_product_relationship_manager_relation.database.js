const tableName = "lead_product_relationship_manager_relation";
const { SupabaseClient } = require("@supabase/supabase-js");

class LeadProductRelationshipManagerRelationDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async autoAssignRelationshipManagerToLead(lead_product_relation_id, lead_product_company_id, lead_product_category_id, lead_city_id, lead_state_id) {
        const { data, error } = await this.db.rpc("auto_assign_rm_to_lead", {
            lead_product_relation_id: lead_product_relation_id,
            lead_product_company_id: lead_product_company_id,
            lead_product_category_id: lead_product_category_id,
            lead_city_id: lead_city_id,
            lead_state_id: lead_state_id
        })

        if (data) {
            return data;
        } else {
            return false;
        }
    }
}

module.exports = LeadProductRelationshipManagerRelationDatabase;
