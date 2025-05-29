const LeadDatabase = require("../../../infrastructure/databases/lead/lead.database");
const LeadProductRelationshipManagerRelationDatabase = require("../../../infrastructure/databases/relationship-manager/lead_product_relationship_manager_relation.database");
const LeadProductRelationDatabase = require("../../../infrastructure/databases/lead_product_relation/lead_product_relation.database.js");
const { generateOtpToken, verifyOtpToken } = require("../../../utils/jwt.util.js");

class LeadService {
    constructor(supabaseInstance) {
        this.leadDatabase = new LeadDatabase(supabaseInstance);
        this.leadProductRelationshipManagerRelationDatabase =
            new LeadProductRelationshipManagerRelationDatabase(supabaseInstance);
        this.leadProductRelationDatabase = new LeadProductRelationDatabase(supabaseInstance);
    }

    async getLeadList(
        pageNumber,
        limit,
        search,
        status,
        priority,
        category_id,
        company_id,
        advisor_id,
    ) {
        try {
            const { data, total_count } = await this.leadDatabase.getLeadsWithPagination(
                pageNumber,
                limit,
                search,
                status,
                priority,
                category_id,
                company_id,
                advisor_id,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                metadata: {
                    page: pageNumber,
                    per_page: limit,
                    total_count,
                    // total_pages,
                },
            };
        } catch (error) {
            console.error("Error in getLeadList:", error);
            throw new Error(`Failed to fetch lead list: ${error.message || JSON.stringify(error)}`);
        }
    }

    async addLead(
        name,
        email,
        contact_number,
        dob,
        address,
        city_id,
        priority,
        additional_note,
        product_id,
        category_id,
        advisor_id,
    ) {
        try {
            // Insert into lead table
            const lead = await this.leadDatabase.createLead(
                name,
                email,
                contact_number,
                dob,
                address,
                city_id,
            );

            // Insert into lead_product_relation table
            const createLeadProductRelationResponse =
                await this.leadDatabase.createLeadProductRelation(
                    lead.lead_id,
                    product_id,
                    category_id,
                    advisor_id,
                    priority,
                    additional_note,
                );
            if (createLeadProductRelationResponse) {
                const leadProductCompanyId =
                    createLeadProductRelationResponse?.product_id?.company_id?.company_id;
                const leadProductCategoryId =
                    createLeadProductRelationResponse?.product_id?.sub_category_id?.category_id
                        ?.category_id;
                const leadCityId = createLeadProductRelationResponse?.lead_id?.city_id?.id;
                const leadStateId =
                    createLeadProductRelationResponse?.lead_id?.city_id?.state_id?.id;

                const leadProductRelationshipManagerRelationDatabaseResponse =
                    await this.leadProductRelationshipManagerRelationDatabase.autoAssignRelationshipManagerToLead(
                        createLeadProductRelationResponse.lead_product_id,
                        leadProductCompanyId,
                        leadProductCategoryId,
                        leadCityId,
                        leadStateId,
                    );
                // console.log(
                //     "leadProductRelationshipManagerRelationDatabaseResponse",
                //     leadProductRelationshipManagerRelationDatabaseResponse,
                // );

                // Todo: Send whatsapp message to Relationship Manager
                if (leadProductRelationshipManagerRelationDatabaseResponse) {
                }
            }

            return {
                lead_id: lead.lead_id,
                name,
                email,
                contact_number: contact_number.toString(),
                dob,
                address,
                city_id,
                priority,
                additional_note,
                product_id,
                advisor_id,
            };
        } catch (error) {
            console.error("Error in addLead:", error);
            throw new Error(`Failed to add lead: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getLeadStatisticsNumber() {
        try {
            const total = await this.leadDatabase.getTotalLeadCount();
            const newLeads = await this.leadDatabase.getNewLeadCount();
            const assignedLeads = await this.leadDatabase.getAssignedLeadCount();
            const convertedLeads = await this.leadDatabase.getConvertedLeadCount();
            const lostLeads = await this.leadDatabase.getLostLeadCount();

            return {
                total,
                new: newLeads,
                assigned: assignedLeads,
                converted: convertedLeads,
                lost: lostLeads,
            };
        } catch (error) {
            console.error("Error in getLeadStatisticsNumber:", error);
            throw new Error(
                `Failed to fetch lead statistics: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getLeadProductRelationByAdvisorIdService(page_number, limit, advisor_id) {
        try {
            const { data, total_count } =
                await this.leadProductRelationDatabase.getLeadProductRelationByAdvisorIdDatabase(
                    page_number,
                    limit,
                    advisor_id,
                );
            const total_pages = Math.ceil(total_count / limit);
            return {
                data: data || [],
                metadata: {
                    page: page_number,
                    per_page: limit,
                    total_count: total_count || 0,
                    total_pages,
                },
            };
        } catch (error) {
            console.error("Error in getLeadProductRelationByAdvisorIdService:", error);
            throw new Error(
                `Failed to fetch lead product relation: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async sendLeadOtp(mobile_number) {
        try {
            // const otp = generateOtp(4);
            const otp = 1234;
            const token = generateOtpToken({ mobile_number, otp });

            return { token, mobile_number };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    async verifyLeadMobile(token, otp, mobile_number) {
        try {
            const decoded = await verifyOtpToken(token);
            if (decoded?.success) {
                const data = decoded?.data;
                const tokenOtp = data.otp;
                const tokenMobile = data.mobile_number;
                if (tokenMobile !== mobile_number) {
                    throw new Error("Mobile number does not match token");
                }
                if (parseInt(otp) !== parseInt(tokenOtp)) {
                    throw new Error("Invalid OTP");
                }
                return {
                    message: "Mobile number verified successfully",
                    mobile_number,
                };
            } else {
                throw new Error(decoded?.message || "Verification failed");
            }
        } catch (error) {
            throw new Error(error.message || "Verification failed");
        }
    }

    async sendEmailOtp(email) {
        try {
            // const otp = generateOtp(4);
            const otp = 1234;
            const token = generateOtpToken({ email, otp });

            return { token, email };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    async verifyLeadEmail(token, otp, email) {
        try {
            const decoded = await verifyOtpToken(token);

            if (decoded?.success) {
                const data = decoded?.data;
                const tokenOtp = data.otp;
                const tokenMobile = data.email;
                if (tokenMobile !== email) {
                    throw new Error("Email does not match token");
                }
                if (parseInt(otp) !== parseInt(tokenOtp)) {
                    throw new Error("Invalid OTP");
                }
                return {
                    message: "Email verified successfully",
                    email,
                };
            } else {
                throw new Error(decoded?.message || "Verification failed");
            }
        } catch (error) {
            throw new Error(error.message || "Verification failed");
        }
    }

    async leadDetailsByLprIdService(lead_product_relation_display_id) {
        return await this.leadProductRelationDatabase.leadDetailsByLprIdDatabase(
            lead_product_relation_display_id,
        );
    }
}

module.exports = LeadService;
