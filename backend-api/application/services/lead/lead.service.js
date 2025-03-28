const LeadDatabase = require("../../../infrastructure/databases/lead/lead.database");

class LeadService {
    constructor(supabaseInstance) {
        this.leadDatabase = new LeadDatabase(supabaseInstance);
    }

    async getLeadList(pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;

            // Fetch paginated data and total count
            const { data, total_count } = await this.leadDatabase.getLeadsWithPagination(
                offset,
                limit,
            );

            // Calculate total pages
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                total_count,
                total_pages,
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
            await this.leadDatabase.createLeadProductRelation(
                lead.lead_id,
                product_id,
                advisor_id,
                priority,
                additional_note,
            );

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
