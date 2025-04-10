const { SupabaseClient } = require("@supabase/supabase-js");
const AdvisorDatabase = require("../../../infrastructure/databases/advisor/advisor.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../../../utils/crypto.util");
const authUtil = require("../../../utils/auth.util.js");

class AdvisorService {
    constructor(supabaseInstance) {
        this.advisorDatabase = new AdvisorDatabase(supabaseInstance);
        this.aadharStorage = new BucketNameStorage(supabaseInstance, "aadhar-cards");
        this.panStorage = new BucketNameStorage(supabaseInstance, "pan-cards");
    }

    async createAdvisor(
        join_as,
        name,
        mobile_number,
        email,
        aadhar_card_number,
        pan_card_number,
        qualification,
        bank_name,
        bank_ifsc_code,
        bank_branch,
        bank_account_number,
        aadhar_card_file,
        pan_card_file,
    ) {
        try {
            const advisor = await this.advisorDatabase.createAdvisor(
                join_as,
                name,
                mobile_number,
                email,
                aadhar_card_number,
                pan_card_number,
                qualification,
            );

            await this.advisorDatabase.createBankDetails(
                advisor.advisor_id,
                bank_name,
                bank_ifsc_code,
                bank_branch,
                bank_account_number,
            );

            const aadharExt = aadhar_card_file.mimetype === "application/pdf" ? "pdf" : "jpeg";
            const aadharFilePath = `${advisor.advisor_id}_aadhar.${aadharExt}`;
            const aadharUploadResult = await this.aadharStorage.uploadFile(
                aadharFilePath,
                aadhar_card_file.buffer,
                aadhar_card_file.mimetype,
            );

            const aadharUrl = await this.aadharStorage.getPublicUrl(aadharFilePath);

            const panExt = pan_card_file.mimetype === "application/pdf" ? "pdf" : "jpeg";
            const panFilePath = `${advisor.advisor_id}_pan.${panExt}`;
            const panUploadResult = await this.panStorage.uploadFile(
                panFilePath,
                pan_card_file.buffer,
                pan_card_file.mimetype,
            );

            const panUrl = await this.panStorage.getPublicUrl(panFilePath);

            const updatedAdvisor = await this.advisorDatabase.updateAdvisorFiles(
                advisor.advisor_id,
                aadharUrl,
                panUrl,
            );

            return updatedAdvisor;
        } catch (error) {
            console.error("Error in createAdvisor:", error);
            throw new Error(
                `Failed to register advisor: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async sendAdvisorOtp(mobile_number, purpose_for) {
        try {
            const exists = await this.advisorDatabase.checkMobileNumber(mobile_number);
            if (purpose_for === "registration" && exists) {
                throw new Error("Mobile number already registered");
            }
            if (purpose_for === "login" && !exists) {
                throw new Error("Mobile number not found");
            }
            // const otp = generateOtp(4);
            const otp = 1234;
            const token = jwt.sign(
                { mobile_number, otp, purpose_for },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "10m" },
            );

            return { token, mobile_number };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    // New verifyAdvisorMobile method
    async verifyAdvisorMobile(token, otp, mobile_number, purpose_for) {
        try {
            // Decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
            const tokenOtp = decoded.otp;
            const tokenMobile = decoded.mobile_number;

            // Validate mobile number consistency
            if (tokenMobile !== mobile_number) {
                throw new Error("Mobile number does not match token");
            }

            // Check OTP match
            if (parseInt(otp) !== parseInt(tokenOtp)) {
                throw new Error("Invalid OTP");
            }

            if (purpose_for === "registration") {
                return {
                    data: {
                        message: "Mobile number verified successfully",
                        mobile_number,
                    },
                };
            } else if (purpose_for === "login") {
                // Fetch user from database
                const user = await this.advisorDatabase.getAdvisorByMobile(mobile_number);
                if (!user) {
                    throw new Error("User not found");
                }

                // Generate tokens
                // const access_token = jwt.sign(
                //     { advisor_id: user.advisor_id, mobile_number },
                //     process.env.JWT_SECRET || "your-secret-key",
                //     { expiresIn: "15m" },
                // );
                // const refresh_token = jwt.sign(
                //     { advisor_id: user.advisor_id, mobile_number },
                //     process.env.JWT_SECRET || "your-secret-key",
                //     { expiresIn: "7d" },
                // );
                const userOject = { ...user };
                console.log({ userOject });

                const logInTokens = authUtil.logInGenerateAndStoreToken(userOject);

                return {
                    data: user,
                    token: logInTokens,
                };
            }
        } catch (error) {
            throw new Error(error.message || "Verification failed");
        }
    }
    // New sendAdvisorEmailOtp method
    async sendAdvisorEmailOtp(email) {
        try {
            console.log("Sending OTP for email:", email);
            const exists = await this.advisorDatabase.checkEmail(email);
            console.log("Email exists:", exists);

            if (exists) {
                throw new Error("Email already registered");
            }

            // const otp = generateOtp(4);
            const otp = 1234;
            const token = jwt.sign({ email, otp }, process.env.JWT_SECRET || "your-secret-key", {
                expiresIn: "10m",
            });

            console.log(`OTP for ${email}: ${otp}`);
            return { token, email };
        } catch (error) {
            console.error("Error in sendAdvisorEmailOtp:", error);
            throw new Error(`Failed to send OTP: ${error.message || JSON.stringify(error)}`);
        }
    }

    // New verifyAdvisorEmail method
    async verifyAdvisorEmail(token, otp, email) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
            const tokenOtp = decoded.otp;
            const tokenEmail = decoded.email;

            if (tokenEmail !== email) {
                throw new Error("Email does not match token");
            }

            if (parseInt(otp) !== parseInt(tokenOtp)) {
                throw new Error("Invalid OTP");
            }

            return {
                data: {
                    message: "Email verified successfully",
                    email,
                },
            };
        } catch (error) {
            console.error("Error in verifyAdvisorEmail:", error);
            throw new Error(error.message || "Verification failed");
        }
    }

    // New getAdvisorStatistics method
    async getAdvisorStatistics() {
        try {
            console.log("Fetching advisor statistics");
            const total = await this.advisorDatabase.getTotalAdvisors();
            const active = await this.advisorDatabase.getActiveAdvisors();
            const inactive = await this.advisorDatabase.getInactiveAdvisors();
            const pending = await this.advisorDatabase.getPendingAdvisors();

            return {
                total,
                active,
                inactive,
                pending,
            };
        } catch (error) {
            console.error("Error in getAdvisorStatistics:", error);
            throw new Error(
                `Failed to retrieve advisor statistics: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New getAdvisorList method
    async getAdvisorList(page, perPage, activeStatus, onboardingStatus, joinAs) {
        try {
            console.log("Fetching advisor list with:", {
                page,
                perPage,
                activeStatus,
                onboardingStatus,
                joinAs,
            });
            const { advisors, totalCount } = await this.advisorDatabase.getAdvisorsWithPagination(
                page,
                perPage,
                activeStatus,
                onboardingStatus,
                joinAs,
            );

            let _advisors = [];
            if (advisors) {
                _advisors = advisors.map(m => ({
                    ...m,
                    onboarding_status: m.advisor_onboarding_status_id.title,
                }));
            }

            const totalPages = Math.ceil(totalCount / perPage);

            return {
                advisors: _advisors,
                metadata: {
                    page,
                    per_page: perPage,
                    total_count: totalCount,
                    total_pages: totalPages,
                },
            };
        } catch (error) {
            console.error("Error in getAdvisorList:", error);
            throw new Error(
                `Failed to retrieve advisor list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New getAdvisorDetailsById method
    async getAdvisorDetailsById(advisorId) {
        try {
            const advisor = await this.advisorDatabase.getAdvisorById(advisorId);

            if (!advisor) {
                throw new Error("Advisor not found");
            }

            return {
                ...advisor,
            };
        } catch (error) {
            console.error("Error in getAdvisorDetailsById:", error);
            throw new Error(
                `Failed to retrieve advisor details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New approveAdvisorRequest method
    async approveAdvisorRequest(advisorId) {
        try {
            console.log("Approving advisor request for ID:", advisorId);
            const updatedAdvisor = await this.advisorDatabase.updateAdvisorStatus(advisorId, 2); // 2 = Approved

            if (!updatedAdvisor) {
                throw new Error("Advisor not found");
            }

            return updatedAdvisor;
        } catch (error) {
            console.error("Error in approveAdvisorRequest:", error);
            throw new Error(
                `Failed to approve advisor request: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New rejectAdvisorRequest method
    // async rejectAdvisorRequest(advisorId) {
    //     try {
    //         console.log("Rejecting advisor request for ID:", advisorId);
    //         const updatedAdvisor = await this.advisorDatabase.updateAdvisorStatus(advisorId, 3); // 3 = Rejected

    //         if (!updatedAdvisor) {
    //             throw new Error("Advisor not found");
    //         }

    //         return updatedAdvisor;
    //     } catch (error) {
    //         console.error("Error in rejectAdvisorRequest:", error);
    //         throw new Error(
    //             `Failed to reject advisor request: ${error.message || JSON.stringify(error)}`,
    //         );
    //     }
    // }

    // New resubmitAdvisorRequest method
    async RejectAdvisorRequest(advisorId, reasonType, reason, actionByUserId) {
        try {
            console.log("Marking advisor request for re-submission for ID:", advisorId);
            const remark = {
                reason_type: reasonType,
                reason,
                action_by_user_id: actionByUserId,
                created_at: new Date().toISOString(),
            };
            const updatedAdvisor = await this.advisorDatabase.updateAdvisorForRejection(
                advisorId,
                4,
                remark,
            ); // 3 = Rejected

            if (!updatedAdvisor) {
                throw new Error("Advisor not found");
            }

            return updatedAdvisor;
        } catch (error) {
            console.error("Error in resubmitAdvisorRequest:", error);
            throw new Error(
                `Failed to mark advisor request for re-submission: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateAdvisorTabAccessService(advisor_id, tab_access) {
        try {
            const { data, error } = await this.advisorDatabase.updateAdvisorTabAccessDatabase(
                advisor_id,
                tab_access,
            );

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
}

module.exports = AdvisorService;
