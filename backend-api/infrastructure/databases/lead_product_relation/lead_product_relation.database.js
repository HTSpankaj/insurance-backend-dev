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

    async getLeadProductRelationByLeadIdAndProductId(
        lead_id,
        productId,
        lead_product_relation_display_id,
    ) {
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

    async getLeadProductRelationByAdvisorIdDatabase(
        page_number,
        limit,
        advisor_id,
        start_date,
        end_date,
    ) {
        const offset = (page_number - 1) * limit;
        let query = this.db
            .from(tableName)
            .select(
                `
                *, lead_status_id(title),
                lead_id(name, email, contact_number, dob, address, city_id(title, state_id(title)), lead_display_id),
                product_id(product_id, product_name, description, company_id(company_id, company_name), sub_category_id(sub_category_id, title, category_id(category_id, title))),
                before_issuance_excel_data_id(policy_amount),
                after_issuance_transaction(commission_amount, actual_number_transaction, current_number_invoice_created, issuance_transaction_invoice(amount, paid_amount, invoice_id(invoice_id, invoice_display_id,advisor_invoice_status, invoice_payment_status,paid_amount), created_at))
                `,
            )
            // after_issuance_transaction(commission_amount, actual_number_transaction, current_number_invoice_created, issuance_transaction_invoice(advisor_invoice_status, invoice_payment_status, paid_amount, created_at))
            .eq("advisor_id", advisor_id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (start_date) {
            query = query.gte("created_at", start_date);
        }
        if (end_date) {
            query = query.lte("created_at", end_date);
        }

        const { data, total_count, error } = await query;
        if (error) {
            console.error("Error in getLeadProductRelationByAdvisorIdDatabase:", error);
            throw new Error(
                `Failed to get lead product relation by advisor id: ${error.message || JSON.stringify(error)}`,
            );
        }
        return { data, total_count };
    }

    async leadDetailsByLprIdDatabase(lead_product_relation_display_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select(
                    `
                    lead_product_id, priority, additinal_note, approximate_commission, amount, lead_status_id(title), lead_product_relation_display_id,
                    lead_id(name, email, contact_number, dob, address, city_id(title, state_id(title)), lead_display_id),
                    product_id(product_id, product_name, description, financial_description, product_display_id, company_id(company_id, company_name, company_display_id, logo_url), sub_category_id(sub_category_id, title, category_id(category_id, title))),
                    advisor_id(advisor_id,name, join_as, mobile_number, email, advisor_display_id, created_at),
                    before_issuance_excel_data_id(policy_amount, commission_amount),
                    lead_product_relationship_manager_relation(relationship_manager_id(rm_id, name, contact_number, region:relationship_manager_region_relations(*, region_id(region_id, title)))),
                    category_id(category_id, title, description, logo_url),
                    sub_category_id(sub_category_id, title, description, logo_url, category_id(category_id, title, description, logo_url))
                    `,
                )
                .eq("lead_product_relation_display_id", lead_product_relation_display_id)
                .maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error in leadDetailsByLprIdDatabase:", error);
            throw new Error(
                `Failed to get lead details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async SetAssignedLeadStatusByLeadProductRelationId(lead_product_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ lead_status_id: 2 })
                .eq("lead_product_id", lead_product_id)
                .maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error in leadStatusSetToAssigned:", error);
            throw new Error(`Failed to update lead status: ${error.message}`);
        }
    }
}

module.exports = LeadProductRelationDatabase;
