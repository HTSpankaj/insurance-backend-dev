const { SupabaseClient } = require("@supabase/supabase-js");

const invoice_template_generation_TableName = "invoice_template_generation";
const invoice_template_generation_category_relation_TableName = "invoice_template_generation_category_relation";
const invoice_template_generation_sub_category_relation_TableName =
    "invoice_template_generation_sub_category_relation";

class InvoiceTemplateGenerationDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getInvoiceGenerationBySubCategory(sub_category_id) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db
                .from(invoice_template_generation_sub_category_relation_TableName)
                .select("*,invoice_template_generation:invoice_template_generation_id(*)")
                .eq("sub_category_id", sub_category_id);

            if (error) {
                return resolve({
                    success: false,
                    error: error,
                });
            }
            if (!data) {
                return resolve({
                    success: false,
                });
            }
            const _data = data.filter(_f => {
                if (
                    _f.invoice_template_generation.is_active === true &&
                    _f.invoice_template_generation.is_delete === false
                ) {
                    return true;
                }
                return false;
            });
            return resolve({
                success: true,
                data: _data?.[0] || null,
            });
        });
    }

    async invoiceTemplateGenerationDatabase(
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config
    ) {
        try {
            const { data, error } = await this.db
                .from(invoice_template_generation_TableName)
                .insert(
                    {
                        company_header_config,
                        invoice_info_config,
                        bill_to_config,
                        lead_table_preview_config,
                        tax_summary_config,
                        totals_section_config,
                        bank_details_config,
                        terms_conditions_config,
                    },
                ).select("*").maybeSingle();
                if (error) {
                    throw error;
                }
                return data;
        } catch (error) {
            throw new Error(`Failed to create invoice template generation: ${error.message}`);
        }
    }
}

module.exports = InvoiceTemplateGenerationDatabase;
