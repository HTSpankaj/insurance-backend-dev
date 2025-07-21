const LeadProductRelationDatabase = require("../../../infrastructure/databases/lead_product_relation/lead_product_relation.database");
const LeadProductRelationshipManagerRelationDatabase = require("../../../infrastructure/databases/relationship-manager/lead_product_relationship_manager_relation.database");
const RelationshipManagerDatabase = require("../../../infrastructure/databases/relationship-manager/relationship-manager.database");
const OTPSendServiceToRm = require("../../../services/notification/otpSendToRm.service");
const SendLoginCredentialsToRelationshipManagerNotificationService = require("../../../services/notification/SendCredentialsToRelationshipManagerNotification.service");
const { generateOtp, encryptPassword } = require("../../../utils/crypto.util");
const { generateOtpToken, verifyOtpToken } = require("../../../utils/jwt.util");

class RelationshipManagerService {
    constructor(supabaseInstance) {
        this.relationshipManagerDatabase = new RelationshipManagerDatabase(supabaseInstance);
        this.leadProductRelationshipManagerRelationDatabase =
            new LeadProductRelationshipManagerRelationDatabase(supabaseInstance);
        this.leadProductRelationDatabase = new LeadProductRelationDatabase(supabaseInstance);
        this.oTPSendServiceToRm = new OTPSendServiceToRm(supabaseInstance);
        this.sendLoginCredentialsToRelationshipManagerNotificationService =
            new SendLoginCredentialsToRelationshipManagerNotificationService(supabaseInstance);
    }

    async addRelationshipManager(name, contact_number, region, category, company_id, user_id) {
        try {
            // Insert into relationship_manager table
            const relationshipManager =
                await this.relationshipManagerDatabase.createRelationshipManager(
                    name,
                    contact_number,
                    company_id,
                    user_id,
                );

            // Insert into relationship_manager_region_relations table
            await this.relationshipManagerDatabase.createRegionRelations(
                relationshipManager.rm_id,
                region,
            );

            // Insert into relationship_manager_category_relations table
            await this.relationshipManagerDatabase.createCategoryRelations(
                relationshipManager.rm_id,
                category,
            );

            return {
                rm_id: relationshipManager.rm_id,
                name,
                contact_number,
                region,
                category,
            };
        } catch (error) {
            console.error("Error in addRelationshipManager:", error);
            throw new Error(
                `Failed to add relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    async checkRelationshipManager(rm_id, name, contact_number, region, category, company_id) {
        try {
            let messageObj = {};

            const relationshipManagers =
                await this.relationshipManagerDatabase.checkRelationshipManager(company_id);
            if (relationshipManagers?.length > 0) {
                if (relationshipManagers?.some(s => s?.name === name && s?.rm_id !== rm_id)) {
                    messageObj.name = "Name already exists";
                }
                if (
                    relationshipManagers?.some(
                        s => s?.contact_number === contact_number && s?.rm_id !== rm_id,
                    )
                ) {
                    messageObj.contact_number = "Contact number already exists";
                }
            }
            // if (region?.some(s => s?.title?.toLowerCase() === title?.toLowerCase() && s?.region_id !== region_id)) {
            //         messageObj.title = "Region title already exists";
            //     }

            let regionName = [];
            let categoryName = [];

            relationshipManagers.forEach(relationshipManagerElement => {
                relationshipManagerElement?.region?.forEach(_serverRegion => {
                    if (
                        region.includes(_serverRegion.region_id?.region_id) &&
                        _serverRegion?.relationship_manager_id !== rm_id &&
                        !regionName?.includes(_serverRegion?.region_id?.title)
                    ) {
                        regionName.push(_serverRegion.region_id.title);
                    }
                });
                relationshipManagerElement?.category?.forEach(_serverCategory => {
                    if (
                        category.includes(_serverCategory.category_id?.category_id) &&
                        _serverCategory?.relationship_manager_id !== rm_id &&
                        !categoryName?.includes(_serverCategory?.category_id?.title)
                    ) {
                        categoryName.push(_serverCategory.category_id.title);
                    }
                });
            });
            if (regionName?.length > 0) {
                messageObj.region = `Region ${regionName?.join(", ")} already exists`;
            }
            if (categoryName?.length > 0) {
                messageObj.category = `Category ${categoryName?.join(", ")} already exists`;
            }

            return messageObj;
        } catch (error) {
            console.error("Error in checkRelationshipManager:", error);
            throw new Error(
                `Failed to check relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    async updateRelationshipManager(rm_id, name, contact_number, region, category, company_id) {
        try {
            // Insert into relationship_manager table
            const relationshipManager =
                await this.relationshipManagerDatabase.updateRelationshipManager(
                    rm_id,
                    name,
                    contact_number,
                    company_id,
                );

            // Insert into relationship_manager_region_relations table
            await this.relationshipManagerDatabase.updateRegionRelations(
                relationshipManager.rm_id,
                region,
            );

            // Insert into relationship_manager_category_relations table
            await this.relationshipManagerDatabase.updateCategoryRelations(
                relationshipManager.rm_id,
                category,
            );

            return {
                rm_id: relationshipManager.rm_id,
                name,
                contact_number,
                region,
                category,
            };
        } catch (error) {
            console.error("Error in addRelationshipManager:", error);
            throw new Error(
                `Failed to add relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getRelationshipManagerListByCompanyId(
        company_id,
        pageNumber,
        limit,
        search,
        region_id,
        is_admin_rm,
        is_all,
    ) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, total_count } =
                await this.relationshipManagerDatabase.getRelationshipManagersWithPagination(
                    company_id,
                    offset,
                    limit,
                    search,
                    region_id,
                    is_admin_rm,
                    is_all,
                );
            const total_pages = Math.ceil(total_count / limit);

            // return {
            //     data,
            //     total_count,
            //     total_pages,
            // };
            return {
                success: true,
                data,
                metadata: {
                    total_count: total_count,
                    ...(!is_all
                        ? {
                              page: pageNumber,
                              per_page: limit,
                              total_pages: total_pages,
                          }
                        : {}),
                },
            };
        } catch (error) {
            console.error("Error in getRelationshipManagerListByCompanyId:", error);
            throw new Error(
                `Failed to fetch relationship manager list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async relationshipManagerAssignToLeadService(
        lead_product_relation_id,
        relationship_manager_id,
        relationship_manager_assign_by,
    ) {
        try {
            const result =
                await this.leadProductRelationshipManagerRelationDatabase.relationshipManagerAssignToLeadDatabase(
                    lead_product_relation_id,
                    relationship_manager_id,
                    relationship_manager_assign_by,
                );
            if (result?.lead_product_relation_id) {
                await this.leadProductRelationDatabase.SetAssignedLeadStatusByLeadProductRelationId(
                    result.lead_product_relation_id,
                );
            }
            return result;
        } catch (error) {
            console.error("Error in relationshipManagerAssignToLeadService:", error);
            throw new Error(
                `Failed to assign relationship manager to lead: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async sendRmOtp(mobile_number) {
        try {
            let otp = generateOtp(4);

            if (process.env.NODE_ENV?.trim() === "development") {
                otp = 1234;
            } else {
                const oTPSendServiceRes = await this.oTPSendServiceToRm.sendOtpToAdvisorThroughSms(
                    mobile_number,
                    otp,
                );
                console.log("oTPSendServiceRes", oTPSendServiceRes);
            }

            const token = generateOtpToken({ mobile_number, otp });

            return { token, mobile_number };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    async verifyRmMobile(token, otp, mobile_number) {
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

    async deleteRelationshipManagerService(rm_id) {
        return await this.relationshipManagerDatabase.deleteRelationshipManagerDatabase(rm_id);
    }

    async makeCredentialsRelationshipManagerService(relationship_manager_id, email, password) {
        try {
            const encryptedPassword = encryptPassword(password);
            const user =
                await this.relationshipManagerDatabase.makeCredentialsRelationshipManagerDatabase(
                    relationship_manager_id,
                    email,
                    encryptedPassword,
                );

            if (user?.rm_id) {
                const variableList = [
                    { "title": "Name", "variable_name": user?.name },
                    { "title": "Email", "variable_name": email },
                    { "title": "Password", "variable_name": password },
                ];
                this.sendLoginCredentialsToRelationshipManagerNotificationService
                    .SendLoginCredentialsToRelationshipManager(
                        email,
                        user?.contact_number,
                        user?.name,
                        variableList,
                    )
                    .then(res => {
                        console.log(
                            "SendLoginCredentialsToRelationshipManagerNotificationService",
                            res,
                        );
                    })
                    .catch(err => {
                        console.log(
                            "SendLoginCredentialsToRelationshipManagerNotificationService",
                            err,
                        );
                    });
            }
            delete user.password;
            return user;
        } catch (error) {
            throw new Error(error.message || "Failed to create user");
        }
    }
}

module.exports = RelationshipManagerService;
