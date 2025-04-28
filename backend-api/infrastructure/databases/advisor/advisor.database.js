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

    async updateResubmitAdvisor(
        advisor_id,
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
                .update({
                    join_as,
                    name,
                    mobile_number,
                    email,
                    aadhar_card_number,
                    pan_card_number,
                    qualification,
                    advisor_onboarding_status_id: 3,
                })
                .eq("advisor_id", advisor_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in update Advisor:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in update Advisor:", error);
            throw new Error(`Failed to update advisor: ${error.message || JSON.stringify(error)}`);
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
    async updateBankDetails(
        bank_details_id,
        advisor_id,
        bank_name,
        bank_ifsc_code,
        bank_branch,
        bank_account_number,
    ) {
        try {
            const { data, error } = await this.db
                .from(bankTableName)
                .update({
                    advisor_id,
                    bank_name,
                    bank_ifsc_code,
                    bank_branch,
                    bank_account_number,
                })
                .eq("bank_details_id", bank_details_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateBankDetails:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateBankDetails:", error);
            throw new Error(
                `Failed to update bank details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateAdvisorFiles(
        advisor_id,
        frontAadharPublicUrl,
        backAadharPublicUrl,
        frontPanPublicUrl,
        backPanPublicUrl,
    ) {
        try {
            let postBody = {};
            if (frontAadharPublicUrl) postBody.front_aadhar_card_image_url = frontAadharPublicUrl;
            if (backAadharPublicUrl) postBody.back_aadhar_card_image_url = backAadharPublicUrl;
            if (frontPanPublicUrl) postBody.front_pan_card_image_url = frontPanPublicUrl;
            if (backPanPublicUrl) postBody.back_pan_card_image_url = backPanPublicUrl;
            const { data, error } = await this.db
                .from(tableName)
                .update(postBody)
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
                .select("*, advisor_onboarding_status_id(title)")
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
    async getAdvisorsWithPagination(
        page,
        perPage,
        activeStatus,
        onboardingStatus = [],
        joinAs,
        search,
    ) {
        try {
            const from = (page - 1) * perPage;
            const to = from + perPage - 1;

            let _activeStatus = null;
            let _onboardingStatus = null;
            let _joinAs = null;
            if (activeStatus === "Active" || activeStatus === "Inactive") {
                _activeStatus = activeStatus;
            }
            if (onboardingStatus?.length > 0) {
                _onboardingStatus = onboardingStatus
                    .filter(f => onboardingStatusString.some(s => s.title === f))
                    .map(m => onboardingStatusString.find(f => f.title === m).id);
            }
            if (joinAs === "Advisor" || joinAs === "Entrepreneur") {
                _joinAs = joinAs;
            }

            let query = this.db.rpc(
                "get_advisor_list",
                {
                    search_val: search || null,
                    advisor_onboarding_status_val: _onboardingStatus,
                    join_as_val: _joinAs,
                    advisor_status_val: _activeStatus,
                },
                { count: "exact" },
            );

            // Add ORDER BY created_at (descending order, newest first)
            query = query.order("created_at", { ascending: false });
            // Get paginated data
            const { data, error, count } = await query.range(from, to);
            if (error) throw error;

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
                .select("*, bank_details(*)")
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

    // New updateAdvisorForResubmission method
    async updateAdvisorForRejection(advisorId, statusId, remark) {
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

    async updateAdvisorTabAccessDatabase(advisor_id, tab_access) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ tab_access })
                .eq("advisor_id", advisor_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateAdvisorTabAccessDatabase:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateAdvisorTabAccessDatabase:", error);
            throw new Error(
                `Failed to update advisor tab access: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async activeInactiveAdvisorDatabase(advisor_id, advisor_status) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ advisor_status })
                .eq("advisor_id", advisor_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to update advisor status: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getAdvisorStatisticsByAdvisorIdDatabase(advisor_id = null) {
        try {
            const { data, error } = await this.db.rpc("get_advisor_statistics_by_advisor_id", {
                advisor_id_val: advisor_id,
            });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to get advisor statistics: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getAdvisorDetailsFromDisplayIdDatabase(display_id) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db
                .from(tableName)
                .select("*")
                .eq("advisor_display_id", display_id)
                .maybeSingle();

            if (data) {
                resolve(data);
            } else {
                resolve(error || null);
            }
        });
    }
}

module.exports = AdvisorDatabase;
