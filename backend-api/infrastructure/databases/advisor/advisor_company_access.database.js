const tableName = "advisor_company_access";
const { SupabaseClient } = require("@supabase/supabase-js");

const onboardingStatusString = [
    { title: "Pending", id: 1 },
    { title: "Approved", id: 2 },
    { title: "Re-Submitted", id: 3 },
    { title: "Rejected", id: 4 },
];
class AdvisorCompanyAccessDatabase {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async upsertAdvisorCompanyAccessDatabase(advisor_company_access_array) {
        try {
            console.log(advisor_company_access_array);
            const { data, error } = await this.db
                .from(tableName)
                .upsert(advisor_company_access_array, { onConflict: "company_id,advisor_id" })
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to upsert advisor_company_access: ${error.message}`);
        }
    }

    async getAdvisorCompanyAccessDatabase(advisor_id) {
        try {
            const { data, error, count } = await this.db
                .from(tableName)
                .select("company_id(company_id,company_name),is_access, advisor_id", { count: "exact" })
                .eq("advisor_id", advisor_id);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to get advisor_company_access: ${error.message}`);
        }
    }
}

module.exports = AdvisorCompanyAccessDatabase;
