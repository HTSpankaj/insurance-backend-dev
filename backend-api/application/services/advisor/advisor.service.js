const { SupabaseClient } = require("@supabase/supabase-js");
const AdvisorDatabase = require("../../../infrastructure/databases/advisor/advisor.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");
const authUtil = require("../../../utils/auth.util.js");
const { generateOtpToken, verifyOtpToken } = require("../../../utils/jwt.util.js");

class AdvisorService {
    constructor(supabaseInstance) {
        this.advisorDatabase = new AdvisorDatabase(supabaseInstance);
        this.advisorStorage = new BucketNameStorage(supabaseInstance, "advisor");
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
        front_aadhar_card_file,
        back_aadhar_card_file,
        front_pan_card_file,
        back_pan_card_file,
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

            const aadharAndPanCardUploadRes = this.aadharAndPanCardUpload(
                advisor.advisor_id,
                front_aadhar_card_file,
                back_aadhar_card_file,
                front_pan_card_file,
                back_pan_card_file,
            );

            return aadharAndPanCardUploadRes ? aadharAndPanCardUploadRes : advisor;
        } catch (error) {
            console.error("Error in createAdvisor:", error);
            throw new Error(
                `Failed to register advisor: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async reSubmitAdvisor(
        advisor_id,
        bank_details_id,
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
        front_aadhar_card_file,
        back_aadhar_card_file,
        front_pan_card_file,
        back_pan_card_file,
    ) {
        try {
            const advisor = await this.advisorDatabase.updateResubmitAdvisor(
                advisor_id,
                join_as,
                name,
                mobile_number,
                email,
                aadhar_card_number,
                pan_card_number,
                qualification,
            );

            await this.advisorDatabase.updateBankDetails(
                bank_details_id,
                advisor_id,
                bank_name,
                bank_ifsc_code,
                bank_branch,
                bank_account_number,
            );

            const aadharAndPanCardUploadRes = this.aadharAndPanCardUpload(
                advisor.advisor_id,
                front_aadhar_card_file,
                back_aadhar_card_file,
                front_pan_card_file,
                back_pan_card_file,
            );

            return aadharAndPanCardUploadRes ? aadharAndPanCardUploadRes : advisor;
        } catch (error) {
            console.error("Error in reSubmitAdvisor:", error);
            throw new Error(
                `Failed to re-submit advisor: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async aadharAndPanCardUpload(
        advisor_id,
        front_aadhar_card_file,
        back_aadhar_card_file,
        front_pan_card_file,
        back_pan_card_file,
    ) {
        let frontAadharPublicUrl = null;
        let backAadharPublicUrl = null;

        if (front_aadhar_card_file) {
            const _frontAadharFilePath = `${advisor_id}/document/frontAadharCard.${front_aadhar_card_file?.mimetype.split("/")[1]}`;
            const frontAadharUploadResult = await this.advisorStorage.uploadFile(
                _frontAadharFilePath,
                front_aadhar_card_file.buffer,
                front_aadhar_card_file.mimetype,
                false,
            );
            if (frontAadharUploadResult) {
                frontAadharPublicUrl = await this.advisorStorage.getPublicUrl(
                    frontAadharUploadResult?.path,
                );
            }
        }

        if (back_aadhar_card_file) {
            const _backAadharFilePath = `${advisor_id}/document/backAadharCard.${back_aadhar_card_file?.mimetype.split("/")[1]}`;
            const backAadharUploadResult = await this.advisorStorage.uploadFile(
                _backAadharFilePath,
                back_aadhar_card_file.buffer,
                back_aadhar_card_file.mimetype,
                false,
            );
            if (backAadharUploadResult) {
                backAadharPublicUrl = await this.advisorStorage.getPublicUrl(
                    backAadharUploadResult?.path,
                );
            }
        }

        let frontPanPublicUrl = null;
        let backPanPublicUrl = null;

        if (front_pan_card_file) {
            const _frontPanFilePath = `${advisor_id}/document/frontPanCard.${front_pan_card_file?.mimetype.split("/")[1]}`;
            const frontPanUploadResult = await this.advisorStorage.uploadFile(
                _frontPanFilePath,
                front_pan_card_file.buffer,
                front_pan_card_file.mimetype,
            );
            if (frontPanUploadResult) {
                frontPanPublicUrl = await this.advisorStorage.getPublicUrl(
                    frontPanUploadResult?.path,
                );
            }
        }

        if (back_pan_card_file) {
            const _backPanFilePath = `${advisor_id}/document/backPanCard.${back_pan_card_file?.mimetype.split("/")[1]}`;
            const backPanUploadResult = await this.advisorStorage.uploadFile(
                _backPanFilePath,
                back_pan_card_file.buffer,
                back_pan_card_file.mimetype,
            );
            if (backPanUploadResult) {
                backPanPublicUrl = await this.advisorStorage.getPublicUrl(
                    backPanUploadResult?.path,
                );
            }
        }

        let updatedAdvisor = null;
        if (frontAadharPublicUrl || backAadharPublicUrl || frontPanPublicUrl || backPanPublicUrl) {
            updatedAdvisor = await this.advisorDatabase.updateAdvisorFiles(
                advisor_id,
                frontAadharPublicUrl,
                backAadharPublicUrl,
                frontPanPublicUrl,
                backPanPublicUrl,
            );
        }
        return updatedAdvisor;
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
            const token = generateOtpToken({ mobile_number, otp, purpose_for });

            return { token, mobile_number };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    // New verifyAdvisorMobile method
    async verifyAdvisorMobile(token, otp, mobile_number, purpose_for) {
        try {
            const decoded = await verifyOtpToken(token);

            if (decoded?.success) {
                const decodedData = decoded?.data;
                const tokenOtp = decodedData.otp;
                const tokenMobile = decodedData.mobile_number;

                if (tokenMobile !== mobile_number) {
                    throw new Error("Mobile number does not match token");
                }
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
                    const user = await this.advisorDatabase.getAdvisorByMobile(mobile_number);
                    if (!user) {
                        throw new Error("User not found");
                    }

                    const userOject = { ...user };
                    const logInTokens = authUtil.logInGenerateAndStoreToken(userOject);

                    return {
                        data: user,
                        token: logInTokens,
                    };
                }
            } else {
                throw new Error(decoded?.message || "Verification failed");
            }
        } catch (error) {
            throw new Error(error.message || "Verification failed");
        }
    }
    // New sendAdvisorEmailOtp method
    async sendAdvisorEmailOtp(email) {
        try {
            const exists = await this.advisorDatabase.checkEmail(email);
            if (exists) {
                throw new Error("Email already registered");
            }

            // const otp = generateOtp(4);
            const otp = 1234;
            const token = generateOtpToken({ email, otp });

            return { token, email };
        } catch (error) {
            console.error("Error in sendAdvisorEmailOtp:", error);
            throw new Error(`Failed to send OTP: ${error.message || JSON.stringify(error)}`);
        }
    }

    // New verifyAdvisorEmail method
    async verifyAdvisorEmail(token, otp, email) {
        try {
            const decoded = await verifyOtpToken(token);

            if (decoded?.success) {
                const decodedData = decoded?.data;
                const tokenOtp = decodedData.otp;
                const tokenEmail = decodedData.email;
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
            } else {
                throw new Error(decoded?.message || "Verification failed");
            }
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
    async getAdvisorList(page, perPage, activeStatus, onboardingStatus, joinAs, search) {
        try {
            const { advisors, totalCount } = await this.advisorDatabase.getAdvisorsWithPagination(
                page,
                perPage,
                activeStatus,
                onboardingStatus,
                joinAs,
                search,
            );

            const totalPages = Math.ceil(totalCount / perPage);

            return {
                advisors: advisors,
                metadata: {
                    total_count: totalCount,
                    current_page_count: advisors.length,
                    page,
                    per_page: perPage,
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

    async activeInactiveAdvisorService(advisor_id, advisor_status) {
        try {
            const { data, error } = await this.advisorDatabase.activeInactiveAdvisorDatabase(
                advisor_id,
                advisor_status,
            );

            if (error) {
                console.error("Supabase error in activeInactiveAdvisorDatabase:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in activeInactiveAdvisorDatabase:", error);
            throw new Error(
                `Failed to update advisor status: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getAdvisorStatisticsByAdvisorIdService(advisor_id) {
        try {
            const data =
                await this.advisorDatabase.getAdvisorStatisticsByAdvisorIdDatabase(advisor_id);
            return data;
        } catch (error) {
            console.error("Error in getAdvisorStatisticsByAdvisorIdDatabase:", error);
            throw new Error(
                `Failed to get advisor statistics: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = AdvisorService;
