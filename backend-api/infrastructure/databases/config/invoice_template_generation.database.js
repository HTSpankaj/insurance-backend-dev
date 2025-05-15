const { SupabaseClient } = require("@supabase/supabase-js");

const invoice_template_generation_TableName = "invoice_template_generation";
const invoice_template_generation_category_relation_TableName =
    "invoice_template_generation_category_relation";
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
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        category = [],
        sub_category = [],
    ) {
        try {
            const { data, error } = await this.db
                .from(invoice_template_generation_TableName)
                .insert({
                    title,
                    company_header_config,
                    invoice_info_config,
                    bill_to_config,
                    lead_table_preview_config,
                    tax_summary_config,
                    totals_section_config,
                    bank_details_config,
                    terms_conditions_config,
                })
                .select("*")
                .maybeSingle();
            if (data) {
                const catRes = await this.db
                    .from(invoice_template_generation_category_relation_TableName)
                    .insert(
                        category.map(category_id => ({
                            invoice_template_generation_id: data.id,
                            category_id,
                        })),
                    )
                    .select("*");

                const subatRes = await this.db
                    .from(invoice_template_generation_sub_category_relation_TableName)
                    .insert(
                        sub_category.map(sub_category_id => ({
                            invoice_template_generation_id: data.id,
                            sub_category_id,
                        })),
                    )
                    .select("*");

                // console.log("catRes", catRes, "subatRes", subatRes);
            }

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            throw new Error(`Failed to create invoice template generation: ${error.message}`);
        }
    }

    async updateInvoiceTemplateGenerationDatabase(
        id,
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        logo_url,
        category = [],
        sub_category = [],
    ) {
        try {
            let postBody = {};

            if (title) {
                postBody.title = title;
            }
            if (company_header_config) {
                postBody.company_header_config = company_header_config;
            }
            if (invoice_info_config) {
                postBody.invoice_info_config = invoice_info_config;
            }
            if (bill_to_config) {
                postBody.bill_to_config = bill_to_config;
            }
            if (lead_table_preview_config) {
                postBody.lead_table_preview_config = lead_table_preview_config;
            }
            if (tax_summary_config) {
                postBody.tax_summary_config = tax_summary_config;
            }
            if (totals_section_config) {
                postBody.totals_section_config = totals_section_config;
            }
            if (bank_details_config) {
                postBody.bank_details_config = bank_details_config;
            }
            if (terms_conditions_config) {
                postBody.terms_conditions_config = terms_conditions_config;
            }
            if (logo_url) {
                postBody.logo_url = logo_url;
            }

            const { data, error } = await this.db
                .from(invoice_template_generation_TableName)
                .update(postBody)
                .eq("id", id)
                .select("*")
                .maybeSingle();

            if (data) {
                if (category?.length) {
                    await this.db
                        .from(invoice_template_generation_category_relation_TableName)
                        .delete()
                        .eq("invoice_template_generation_id", id);

                    await this.db
                        .from(invoice_template_generation_category_relation_TableName)
                        .insert(
                            category.map(category_id => ({
                                invoice_template_generation_id: data.id,
                                category_id,
                            })),
                        )
                        .select("*");
                }

                if (sub_category?.length) {
                    await this.db
                        .from(invoice_template_generation_sub_category_relation_TableName)
                        .delete()
                        .eq("invoice_template_generation_id", id);

                    await this.db
                        .from(invoice_template_generation_sub_category_relation_TableName)
                        .insert(
                            sub_category.map(sub_category_id => ({
                                invoice_template_generation_id: data.id,
                                sub_category_id,
                            })),
                        )
                        .select("*");
                }
            }

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            throw new Error(`Failed to update invoice template generation: ${error.message}`);
        }
    }

    async getInvoiceTemplateGenerationDatabase(page_number, limit, search) {
        try {
            const offset = (page_number - 1) * limit;

            let query = this.db
                .from(invoice_template_generation_TableName)
                .select(
                    "*, invoice_template_id(*), category:invoice_template_generation_category_relation(category_id(category_id, title)), sub_category:invoice_template_generation_sub_category_relation(sub_category_id(sub_category_id, title))",
                    { count: "exact" },
                )
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (search && search.trim() !== "") {
                query = query.ilike("title", `%${search}%`);
            }

            const { data, error, count } = await query.eq("is_delete", false);
            let _data = [];

            if (data) {
                _data = data.map(item => {
                    return {
                        ...item,
                        category: item?.category?.map(category => category?.category_id),
                        sub_category: item?.sub_category?.map(
                            subCategory => subCategory?.sub_category_id,
                        ),
                    };
                });
            }

            if (error) throw error;
            return { data: _data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch invoice template generation: ${error.message}`);
        }
    }
}

module.exports = InvoiceTemplateGenerationDatabase;
