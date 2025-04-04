const tableName = "advisors";
const bankTableName = "bank_details";
const { SupabaseClient } = require("@supabase/supabase-js");

const onboardingStatusString = [
    { title: "Pending", id: 1 },
    { title: "Approved", id: 2 },
    { title: "Re-Submitted", id: 3 },
    { title: "Rejected", id: 4 },
];
class AdvisorDatabase {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createAdvisor(
        join_as,
        name,
        mobile_number,
        email,
        aadhar_card_number,
        pan_card_number,
        qualification,
    ) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({
                    join_as,
                    name,
                    mobile_number,
                    email,
                    aadhar_card_number,
                    pan_card_number,
                    qualification,
                    advisor_status: "Active", // Explicitly set to Active
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createAdvisor:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createAdvisor:", error);
            throw new Error(`Failed to create advisor: ${error.message || JSON.stringify(error)}`);
        }
    }

    async createBankDetails(
        advisor_id,
        bank_name,
        bank_ifsc_code,
        bank_branch,
        bank_account_number,
    ) {
        try {
            const { data, error } = await this.db
                .from(bankTableName)
                .insert({
                    advisor_id,
                    bank_name,
                    bank_ifsc_code,
                    bank_branch,
                    bank_account_number,
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createBankDetails:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createBankDetails:", error);
            throw new Error(
                `Failed to create bank details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateAdvisorFiles(advisor_id, aadhar_card_image_url, pan_card_image_url) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({
                    aadhar_card_image_url,
                    pan_card_image_url,
                })
                .eq("advisor_id", advisor_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateAdvisorFiles:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateAdvisorFiles:", error);
            throw new Error(
                `Failed to update advisor files: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async checkMobileNumber(mobile_number) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select("mobile_number")
                .eq("mobile_number", mobile_number)
                .maybeSingle();
            if (error) throw error;
            return !!data;
        } catch (error) {
            throw new Error(`Failed to check mobile number: ${error.message}`);
        }
    }
    // New method to fetch advisor by mobile number
    async getAdvisorByMobile(mobile_number) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select("*")
                .eq("mobile_number", mobile_number)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch advisor: ${error.message || JSON.stringify(error)}`);
        }
    }
    // New checkEmail method
    async checkEmail(email) {
        try {
            console.log("Checking email:", email);
            const { data, error } = await this.db
                .from(tableName)
                .select("email")
                .eq("email", email)
                .limit(1);

            if (error) {
                console.error("Supabase error in checkEmail:", error);
                throw error;
            }
            console.log("Check email result:", data);
            return data.length > 0; // True if email exists, false if not
        } catch (error) {
            console.error("Error in checkEmail:", error);
            throw new Error(`Failed to check email: ${error.message || JSON.stringify(error)}`);
        }
    }

    // New methods for statistics
    async getTotalAdvisors() {
        try {
            const { count, error } = await this.db
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .limit(1);

            if (error) throw error;
            console.log("Total advisors:", count);
            return count || 0;
        } catch (error) {
            throw new Error(
                `Failed to get total advisors: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getActiveAdvisors() {
        try {
            const { count, error } = await this.db
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .eq("advisor_status", "Active")
                .limit(1);

            if (error) throw error;
            console.log("Active advisors:", count);
            return count || 0;
        } catch (error) {
            throw new Error(
                `Failed to get active advisors: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getInactiveAdvisors() {
        try {
            const { count, error } = await this.db
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .eq("advisor_status", "Inactive")
                .limit(1);

            if (error) throw error;
            console.log("Inactive advisors:", count);
            return count || 0;
        } catch (error) {
            throw new Error(
                `Failed to get inactive advisors: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getPendingAdvisors() {
        try {
            const { count, error } = await this.db
                .from(tableName)
                .select("*", { count: "exact", head: true })
                .eq("advisor_onboarding_status_id", 1)
                .limit(1);

            if (error) throw error;
            console.log("Pending advisors:", count);
            return count || 0;
        } catch (error) {
            throw new Error(
                `Failed to get pending advisors: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New getAdvisorsWithPagination method
    async getAdvisorsWithPagination(page, perPage, activeStatus, onboardingStatus = [], joinAs) {
        try {
            const from = (page - 1) * perPage;
            const to = from + perPage - 1;

            let query = this.db.from(tableName).select("*");

            // Apply filters
            if (activeStatus === "Active" || activeStatus === "Inactive") {
                query = query.eq("advisor_status", activeStatus);
            }
            if (onboardingStatus?.length > 0) {
                const _onboardingStatus = onboardingStatus
                    .filter(f => onboardingStatusString.some(s => s.title === f))
                    .map(m => onboardingStatusString.find(f => f.title === m).id);
                query = query.in("advisor_onboarding_status_id", _onboardingStatus);
                console.log(_onboardingStatus);
            }
            if (joinAs === "Advisor" || joinAs === "Entrepreneur") {
                query = query.eq("join_as", joinAs);
            }
            // Add ORDER BY created_at (descending order, newest first)
            query = query.order("created_at", { ascending: false });
            // Get paginated data
            const { data, error } = await query.range(from, to);
            if (error) throw error;

            // Get total count with the same filters
            let countQuery = this.db.from(tableName).select("*", { count: "exact", head: true });
            if (activeStatus === "Active" || activeStatus === "Inactive") {
                countQuery = countQuery.eq("advisor_status", activeStatus);
            }
            if (onboardingStatus === "pending") {
                countQuery = countQuery.eq("advisor_onboarding_status_id", 1);
            }
            if (joinAs === "Advisor" || joinAs === "Entrepreneur") {
                countQuery = countQuery.eq("join_as", joinAs);
            }
            const { count, countError } = await countQuery;
            if (countError) throw countError;

            // console.log("Advisors fetched:", data);
            // console.log("Total count:", count);
            return { advisors: data || [], totalCount: count || 0 };
        } catch (error) {
            console.error("Error in getAdvisorsWithPagination:", error);
            throw new Error(`Failed to fetch advisors: ${error.message || JSON.stringify(error)}`);
        }
    }
    // New getAdvisorById method
    async getAdvisorById(advisorId) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select("*")
                .eq("advisor_id", advisorId)
                .maybeSingle();

            if (error) {
                console.error("Supabase error in getAdvisorById:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in getAdvisorById:", error);
            throw new Error(
                `Failed to fetch advisor by ID: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New updateAdvisorStatus method
    async updateAdvisorStatus(advisorId, statusId) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ advisor_onboarding_status_id: statusId })
                .eq("advisor_id", advisorId)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateAdvisorStatus:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateAdvisorStatus:", error);
            throw new Error(
                `Failed to update advisor status: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    // Ensure this method is added
    async updateAdvisorForResubmission(advisorId, statusId, remark) {
        try {
            console.log(
                "Updating advisor for re-submission for ID:",
                advisorId,
                "with remark:",
                remark,
            );
            const { data: currentData, error: fetchError } = await this.db
                .from(tableName)
                .select("rejection_remark")
                .eq("advisor_id", advisorId)
                .maybeSingle();

            if (fetchError) {
                console.error("Supabase error fetching current rejection_remark:", fetchError);
                throw fetchError;
            }
            if (!currentData) {
                throw new Error("Advisor not found");
            }

            const currentRemarks = Array.isArray(currentData.rejection_remark)
                ? currentData.rejection_remark
                : [];
            const updatedRemarks = [...currentRemarks, remark];

            const { data, error } = await this.db
                .from(tableName)
                .update({
                    advisor_onboarding_status_id: statusId,
                    rejection_remark: updatedRemarks,
                })
                .eq("advisor_id", advisorId)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateAdvisorForResubmission:", error);
                throw error;
            }
            console.log("Updated advisor:", data);
            return data;
        } catch (error) {
            console.error("Error in updateAdvisorForResubmission:", error);
            throw new Error(
                `Failed to update advisor for re-submission: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New updateAdvisorForResubmission method
    async updateAdvisorForResubmission(advisorId, statusId, remark) {
        try {
            console.log(
                "Updating advisor for re-submission for ID:",
                advisorId,
                "with remark:",
                remark,
            );
            // Fetch current rejection_remark array (default to empty array if null)
            const { data: currentData, error: fetchError } = await this.db
                .from(tableName)
                .select("rejection_remark")
                .eq("advisor_id", advisorId)
                .maybeSingle();

            if (fetchError) {
                console.error("Supabase error fetching current rejection_remark:", fetchError);
                throw fetchError;
            }
            if (!currentData) {
                throw new Error("Advisor not found");
            }

            const currentRemarks = Array.isArray(currentData.rejection_remark)
                ? currentData.rejection_remark
                : [];
            const updatedRemarks = [...currentRemarks, remark];

            const { data, error } = await this.db
                .from(tableName)
                .update({
                    advisor_onboarding_status_id: statusId,
                    rejection_remark: updatedRemarks,
                })
                .eq("advisor_id", advisorId)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateAdvisorForResubmission:", error);
                throw error;
            }
            console.log("Updated advisor:", data);
            return data;
        } catch (error) {
            console.error("Error in updateAdvisorForResubmission:", error);
            throw new Error(
                `Failed to update advisor for re-submission: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = AdvisorDatabase;
