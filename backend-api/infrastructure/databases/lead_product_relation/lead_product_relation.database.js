const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "lead_product_relation";

class LeadProductRelationDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getLeadProductRelationByLeadIdAndProductId(lead_id, productId, lead_product_relation_display_id) {
        const { data, error } = await this.db
            .from(tableName)
            .select("*")
            .eq("lead_id", lead_id)
            .eq("product_id", productId)
            .eq("lead_product_relation_display_id", lead_product_relation_display_id)
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

    async setSoldStatusByLeadProductRelationId(lead_product_id, before_issuance_excel_data_id) {
        const { data, error } = await this.db
            .from(tableName)
            .update({
                lead_status_id: 3,
                before_issuance_excel_data_id: before_issuance_excel_data_id,
            })
            .eq("lead_product_id", lead_product_id)
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

    async getLeadProductRelationByAdvisorIdDatabase(page_number, limit, advisor_id) {
        const offset = (page_number - 1) * limit;
        const { data, total_count } = await this.db
            .from(tableName)
            .select(
                `
                *, lead_status_id(title), 
                lead_id(name, email, contact_number, dob, address, city_id(title, state_id(title)), lead_display_id),
                product_id(product_id, product_name, description, company_id(company_id, company_name), sub_category_id(sub_category_id, title, category_id(category_id, title))),
                before_issuance_excel_data_id(policy_amount),
                after_issuance_transaction(commission_amount,actual_number_transaction,current_number_invoice_created, issuance_transaction_invoice(advisor_invoice_status, invoice_payment_status, paid_amount,created_at))
                `,
            )
            .eq("advisor_id", advisor_id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);
        return { data, total_count };
    }
}

module.exports = LeadProductRelationDatabase;
