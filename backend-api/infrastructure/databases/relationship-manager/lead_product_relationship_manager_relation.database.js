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

    async autoAssignRelationshipManagerToLead(
        lead_product_relation_id,
        lead_product_company_id,
        lead_product_category_id,
        lead_city_id,
        lead_state_id,
    ) {
        const { data, error } = await this.db.rpc("auto_assign_rm_to_lead", {
            lead_product_relation_id: lead_product_relation_id,
            lead_product_company_id: lead_product_company_id,
            lead_product_category_id: lead_product_category_id,
            lead_city_id: lead_city_id,
            lead_state_id: lead_state_id,
        });
        if (error) {
            console.error("Error in auto_assign_rm_to_lead:", error);
            console.log("Calling auto_assign_rm_to_lead RPC by params => ",{
                lead_product_relation_id: lead_product_relation_id,
                lead_product_company_id: lead_product_company_id,
                lead_product_category_id: lead_product_category_id,
                lead_city_id: lead_city_id,
                lead_state_id: lead_state_id,
            });
            
        }

        if (data) {
            return data;
        } else {
            return false;
        }
    }

    async relationshipManagerAssignToLeadDatabase(
        lead_product_relation_id,
        relationship_manager_id,
        relationship_manager_assign_by,
    ) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({
                    lead_product_relation_id,
                    relationship_manager_id,
                    relationship_manager_assign_by,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("Failed to release relationship manager assign to lead");

            return data;
        } catch (error) {
            throw new Error(
                `Failed to release relationship manager assign to lead: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = LeadProductRelationshipManagerRelationDatabase;
