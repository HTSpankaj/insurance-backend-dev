const LeadDatabase = require("../../../infrastructure/databases/lead/lead.database");
const LeadProductRelationshipManagerRelationDatabase = require("../../../infrastructure/databases/relationship-manager/lead_product_relationship_manager_relation.database");

class LeadService {
    constructor(supabaseInstance) {
        this.leadDatabase = new LeadDatabase(supabaseInstance);
        this.leadProductRelationshipManagerRelationDatabase = new LeadProductRelationshipManagerRelationDatabase(supabaseInstance);
    }

    async getLeadList(pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, total_count } = await this.leadDatabase.getLeadsWithPagination(
                offset,
                limit,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                metadata: {
                    page: pageNumber,
                    per_page: limit,
                    total_count,
                    total_pages,
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
                    advisor_id,
                    priority,
                    additional_note,
                );
            if (createLeadProductRelationResponse) {
                const leadProductCompanyId = createLeadProductRelationResponse?.product_id?.company_id?.company_id;
                const leadProductCategoryId = createLeadProductRelationResponse?.product_id?.sub_category_id?.category_id?.category_id;
                const leadCityId = createLeadProductRelationResponse?.lead_id?.city_id?.id;
                const leadStateId = createLeadProductRelationResponse?.lead_id?.city_id?.id?.state_id?.id;

                const leadProductRelationshipManagerRelationDatabaseResponse = await this.leadProductRelationshipManagerRelationDatabase.autoAssignRelationshipManagerToLead(
                    createLeadProductRelationResponse.lead_product_id,
                    leadProductCompanyId,
                    leadProductCategoryId,
                    leadCityId,
                    leadStateId
                )
                console.log("leadProductRelationshipManagerRelationDatabaseResponse", leadProductRelationshipManagerRelationDatabaseResponse);

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
}

module.exports = LeadService;
