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
    ) {
        try {
            const { data, error } = await this.db
                .from(companyTableName)
                .insert({
                    company_name,
                    name,
                    email,
                    contact_person,
                    irdai_license_number,
                    tax_gstin_number,
                    is_publish,
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
        logo_url,
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
}

module.exports = CompanyDatabase;
