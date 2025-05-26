const companyTableName = "company";
const supportingDocTableName = "company_supporting_document";
const { SupabaseClient } = require("@supabase/supabase-js");

class CompanyDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createCompany(
        company_name,
        name,
        email,
        contact_person,
        irdai_license_number,
        tax_gstin_number,
        is_publish,
        is_auto_assign_rm,
        logo_url,
        created_by_user_id,
    ) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .insert({
                    company_name: company_name,
                    name: name,
                    email: email,
                    contact_person: contact_person,
                    irdai_license_number: irdai_license_number,
                    tax_gstin_number: tax_gstin_number,
                    is_publish: is_publish,
                    is_auto_assign_rm: is_auto_assign_rm,
                    logo_url: logo_url,
                    created_by_user_id,
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createCompany:", error);
                throw error;
            }
            console.log("Company insert result:", data);
            return data;
        } catch (error) {
            console.error("Error in createCompany:", error);
            throw new Error(`Failed to create company: ${error.message || JSON.stringify(error)}`);
        }
    }

    async updateCompany(
        company_id,
        company_name,
        name,
        email,
        contact_person,
        irdai_license_number,
        tax_gstin_number,
        is_publish,
        is_auto_assign_rm,
        created_by_user_id,
    ) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .update({
                    company_name: company_name,
                    name: name,
                    email: email,
                    contact_person: contact_person,
                    irdai_license_number: irdai_license_number,
                    tax_gstin_number: tax_gstin_number,
                    is_publish: is_publish,
                    is_auto_assign_rm: is_auto_assign_rm,
                    created_by_user_id,
                })
                .eq("company_id", company_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createCompany:", error);
                throw error;
            }
            console.log("Company insert result:", data);
            return data;
        } catch (error) {
            console.error("Error in createCompany:", error);
            throw new Error(`Failed to create company: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getCompanyDetailsByCompanyIdDatabase(company_id) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .select("*, company_supporting_document(*)")
                .eq("company_id", company_id)
                .maybeSingle();

            if (error) {
                console.error("Supabase error in getCompanyDetailsByCompanyIdDatabase:", error);
                throw error;
            }
            return data;
        } catch (error) {
            console.error("Error in getCompanyDetailsByCompanyIdDatabase:", error);
            throw new Error(
                `Failed to get company details by company_id: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async createSupportingDocuments(
        company_id,
        irdai_license_url,
        terms_of_agreement_url,
        business_certification_url,
    ) {
        try {
            const { data, error } = await this.db
                .from(supportingDocTableName)
                .insert({
                    company_id: company_id,
                    irdai_license_url: `${irdai_license_url}?date=${Date?.now()}`,
                    terms_of_agreement_url: `${terms_of_agreement_url}?date=${Date?.now()}`,
                    business_certification_url: `${business_certification_url}?date=${Date?.now()}`,
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createSupportingDocuments:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createSupportingDocuments:", error);
            throw new Error(
                `Failed to insert supporting documents: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    async updateSupportingDocuments(
        company_id,
        irdai_license_url,
        terms_of_agreement_url,
        business_certification_url,
    ) {
        try {
            let postBody = {};
            if (irdai_license_url) {
                postBody.irdai_license_url = irdai_license_url + `?date=${Date.now()}`;
            }
            if (terms_of_agreement_url) {
                postBody.terms_of_agreement_url = terms_of_agreement_url + `?date=${Date.now()}`;
            }
            if (business_certification_url) {
                postBody.business_certification_url =
                    business_certification_url + `?date=${Date.now()}`;
            }
            const { data, error } = await this.db
                .from(supportingDocTableName)
                .update(postBody)
                .eq("company_id", company_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateSupportingDocuments:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateSupportingDocuments:", error);
            throw new Error(
                `update to insert supporting documents: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateCompanyLogo(company_id, logo_url) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .update({ logo_url: `${logo_url}?date=${Date.now()}` })
                .eq("company_id", company_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateCompanyLogo:", error);
                throw error;
            }

            return data;
        } catch (error) {
            throw new Error(
                `Failed to update company logo: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getCompaniesWithStats(pageNumber, limit, search, is_all, is_publish = null) {
        try {
            const { data, error } = await this.db.rpc("get_company_list_with_stats", {
                p_page_number: pageNumber,
                p_limit: limit,
                p_search: search || "",
                is_all,
                is_publish_val: is_publish,
            });
            if (error) {
                console.error("Supabase error in getCompaniesWithStats:", error);
                throw error;
            }
            if (!data || data.length === 0) {
                return {
                    data: [],
                    total_count: 0,
                };
            }
            return {
                // data: data.map(item => ({
                //     company_name: item.company_name,
                //     company_id: item.company_id,
                //     logo_url: item.logo_url,
                //     total_products: Number(item.total_products),
                //     converted_leads: Number(item.converted_leads),
                //     active_leads: Number(item.active_leads),
                // })),
                data,
                total_count: Number(data[0].total_count) || 0,
            };
        } catch (error) {
            console.error("Error in getCompaniesWithStats:", error);
            throw new Error(`Failed to fetch companies: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getConvertedLeadsByCompanyId(companyId, pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;

            // Build the query to fetch converted leads
            let query = this.db
                .from("lead_product_relation")
                .select(
                    `
                    lead_product_id,
                    lead_id,
                    lead:lead_id (*),
                    advisor:advisor_id (name),
                    product:product_id (*),
                    lead_status_id(*),
                    payment:after_issuance_transaction!left(*, payment_log:issuance_transaction_invoice(*))

                `,
                    { count: "exact" },
                )
                .eq("lead_status_id", 3); // SOLD

            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getConvertedLeadsByCompanyId:", error);
                throw error;
            }

            // Map the data to the required format
            // const formattedData = data.map(item => ({
            //     lead_id: item.lead_id,
            //     lead_display_id: item.lead?.lead_display_id || null,
            //     lead_name: item.lead?.name || null,
            //     advisor_name: item.advisor?.name || null,
            //     product_name: item.product?.product_name || null,
            //     policy_amount: null, // Not available in table
            //     commission_amount: null, // Not available in table
            //     last_payment_date: null, // Not available in table
            // }));

            return {
                data: data,
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getConvertedLeadsByCompanyId:", error);
            throw new Error(
                `Failed to fetch converted leads: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getCompanyDetailsByIdWithStatistics(companyId) {
        try {
            const { data, error } = await this.db.rpc("get_company_details_by_id_with_statistics", {
                p_company_id: companyId,
            });

            if (error) {
                console.error("Supabase error in getCompanyDetailsByIdWithStatistics:", error);
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error("Company not found");
            }

            return data[0]; // Return the first row (since it's a single company)
        } catch (error) {
            console.error("Error in getCompanyDetailsByIdWithStatistics:", error);
            throw new Error(
                `Failed to fetch company details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getCompanyByDisplayId(company_display_id) {
        const { data, error } = await this.db
            .from(companyTableName)
            .select("*")
            .eq("company_display_id", company_display_id)
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
}
module.exports = CompanyDatabase;
