const relationshipManagerTableName = "relationship_managers";
const regionRelationsTableName = "relationship_manager_region_relations";
const categoryRelationsTableName = "relationship_manager_category_relations";
const { SupabaseClient } = require("@supabase/supabase-js");

class RelationshipManagerDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createRelationshipManager(name, contact_number, company_id) {
        try {
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .insert({
                    name,
                    contact_number,
                    company_id
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createRelationshipManager:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRelationshipManager:", error);
            throw new Error(
                `Failed to create relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async createRegionRelations(relationship_manager_id, region) {
        try {
            const regionRelations = region.map(region_id => ({
                relationship_manager_id,
                region_id,
            }));

            const { data, error } = await this.db
                .from(regionRelationsTableName)
                .insert(regionRelations)
                .select();

            if (error) {
                console.error("Supabase error in createRegionRelations:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createRegionRelations:", error);
            throw new Error(
                `Failed to insert region relations: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async createCategoryRelations(relationship_manager_id, category) {
        try {
            const categoryRelations = category.map(category_id => ({
                relationship_manager_id,
                category_id,
            }));

            const { data, error } = await this.db
                .from(categoryRelationsTableName)
                .insert(categoryRelations)
                .select();

            if (error) {
                console.error("Supabase error in createCategoryRelations:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in createCategoryRelations:", error);
            throw new Error(
                `Failed to insert category relations: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getRelationshipManagersWithPagination(company_id, offset, limit, search) {
        try {
            // Build the query
            let query = this.db
                .from(relationshipManagerTableName)
                .select(
                    `
                    *,
                    relationship_manager_region_relations!relationship_manager_id (
                        region_id
                    ),
                    relationship_manager_category_relations!relationship_manager_id (
                        category_id
                    )
                `,
                    { count: "exact" },
                )
                .eq("company_id", company_id);

            // Apply search filter
            if (search) {
                query = query.ilike("name", `%${search}%`);
            }

            // Apply pagination
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getRelationshipManagersWithPagination:", error);
                throw error;
            }

            return {
                data: data || [],
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getRelationshipManagersWithPagination:", error);
            throw new Error(
                `Failed to fetch relationship managers: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = RelationshipManagerDatabase;
