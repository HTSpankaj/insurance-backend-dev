const companyTableName = "company";
const supportingDocTableName = "company_supporting_document";
const { SupabaseClient } = require("@supabase/supabase-js");

class CompanyDatabase {
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
        logo_url,
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
                    logo_url: logo_url,
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
                    company_id,
                    irdai_license_url,
                    terms_of_agreement_url,
                    business_certification_url,
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

    async updateCompanyLogo(company_id, logo_url) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .update({ logo_url })
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

    async getCompaniesWithStats(pageNumber, limit, search) {
        try {
            const offset = (pageNumber - 1) * limit;

            // Build the query for companies with pagination and search
            let query = this.db.from(companyTableName).select(
                `
                    company_id,
                    company_display_id,
                    company_name,
                    logo_url
                `,
                { count: "exact" },
            );

            // Apply search filter on company_name
            if (search) {
                query = query.ilike("company_name", `%${search}%`);
            }

            // Apply pagination and order by created_at
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data: companies, count, error } = await query;

            if (error) {
                console.error("Supabase error in getCompaniesWithStats:", error);
                throw error;
            }

            // Fetch statistics for each company
            const companiesWithStats = await Promise.all(
                companies.map(async company => {
                    // Total Products
                    const { count: totalProducts } = await this.db
                        .from("products")
                        .select("*", { count: "exact", head: true })
                        .eq("company_id", company.company_id);

                    // Converted Leads (lead_status_id = 3 for "SOLD")
                    const { count: convertedLeads } = await this.db
                        .from("lead_product_relation")
                        .select("*", { count: "exact", head: true })
                        .eq("lead_status_id", 3)
                        .in(
                            "product_id",
                            await this.db
                                .from("products")
                                .select("product_id")
                                .eq("company_id", company.company_id)
                                .then(res => res.data.map(p => p.product_id)),
                        );

                    // Active Leads (lead_status_id = 1 for "ACTIVE")
                    const { count: activeLeads } = await this.db
                        .from("lead_product_relation")
                        .select("*", { count: "exact", head: true })
                        .eq("lead_status_id", 1)
                        .in(
                            "product_id",
                            await this.db
                                .from("products")
                                .select("product_id")
                                .eq("company_id", company.company_id)
                                .then(res => res.data.map(p => p.product_id)),
                        );

                    return {
                        company_id: company.company_id,
                        company_display_id: company.company_display_id,
                        company_name: company.company_name,
                        logo_url: company.logo_url,
                        total_products: totalProducts || 0,
                        converted_leads: convertedLeads || 0,
                        active_leads: activeLeads || 0,
                    };
                }),
            );

            return {
                data: companiesWithStats,
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getCompaniesWithStats:", error);
            throw new Error(
                `Failed to fetch companies with stats: ${error.message || JSON.stringify(error)}`,
            );
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
                    lead_id,
                    lead:lead_id (name, lead_display_id),
                    advisor:advisor_id (name),
                    product:product_id (product_name),
                    lead_status_id
                `,
                    { count: "exact" },
                )
                .eq("lead_status_id", 3) // SOLD
                .in(
                    "product_id",
                    await this.db
                        .from("products")
                        .select("product_id")
                        .eq("company_id", companyId)
                        .then(res => res.data.map(p => p.product_id)),
                );

            // Apply pagination and order by created_at
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getConvertedLeadsByCompanyId:", error);
                throw error;
            }

            // Map the data to the required format
            const formattedData = data.map(item => ({
                lead_id: item.lead_id,
                lead_display_id: item.lead?.lead_display_id || null,
                lead_name: item.lead?.name || null,
                advisor_name: item.advisor?.name || null,
                product_name: item.product?.product_name || null,
                policy_amount: null, // Not available in table
                commission_amount: null, // Not available in table
                last_payment_date: null, // Not available in table
            }));

            return {
                data: formattedData,
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
}
module.exports = CompanyDatabase;
