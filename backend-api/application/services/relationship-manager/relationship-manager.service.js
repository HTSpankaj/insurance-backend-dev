const LeadProductRelationDatabase = require("../../../infrastructure/databases/lead_product_relation/lead_product_relation.database");
const LeadProductRelationshipManagerRelationDatabase = require("../../../infrastructure/databases/relationship-manager/lead_product_relationship_manager_relation.database");
const RelationshipManagerDatabase = require("../../../infrastructure/databases/relationship-manager/relationship-manager.database");

class RelationshipManagerService {
    constructor(supabaseInstance) {
        this.relationshipManagerDatabase = new RelationshipManagerDatabase(supabaseInstance);
        this.leadProductRelationshipManagerRelationDatabase =
            new LeadProductRelationshipManagerRelationDatabase(supabaseInstance);
        this.leadProductRelationDatabase = new LeadProductRelationDatabase(supabaseInstance);
    }

    async addRelationshipManager(name, contact_number, region, category, company_id) {
        try {
            // Insert into relationship_manager table
            const relationshipManager =
                await this.relationshipManagerDatabase.createRelationshipManager(
                    name,
                    contact_number,
                    company_id,
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

    async getRelationshipManagerListByCompanyId(company_id, pageNumber, limit, search, region_id) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, total_count } =
                await this.relationshipManagerDatabase.getRelationshipManagersWithPagination(
                    company_id,
                    offset,
                    limit,
                    search,
                    region_id,
                );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                total_count,
                total_pages,
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
}

module.exports = RelationshipManagerService;
