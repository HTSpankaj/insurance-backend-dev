const relationshipManagerTableName = "relationship_managers";
const regionRelationsTableName = "relationship_manager_region_relations";
const categoryRelationsTableName = "relationship_manager_category_relations";
const { SupabaseClient } = require("@supabase/supabase-js");

class RelationshipManagerDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createRelationshipManager(name, contact_number, company_id, user_id) {
        try {
            let postBody = {
                name,
                contact_number,
            };
            if (company_id) {
                postBody.company_id = company_id;
            } else {
                postBody.user_id = user_id;
            }
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .insert(postBody)
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
    async checkRelationshipManager(company_id) {
        try {
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .select(
                    "*, region:relationship_manager_region_relations(*, region_id(region_id, title)), category:relationship_manager_category_relations(*, category_id(category_id, title))",
                )
                .eq("company_id", company_id)
                .eq("is_delete", false);

            if (error) {
                console.error("Supabase error in checkRelationshipManager:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in checkRelationshipManager:", error);
            throw new Error(
                `Failed to check relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateRelationshipManager(rm_id, name, contact_number, company_id) {
        try {
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .update({
                    name,
                    contact_number,
                    company_id,
                })
                .eq("rm_id", rm_id)
                .select()
                .maybeSingle();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRelationshipManager:", error);
            throw new Error(
                `Failed to update relationship manager: ${error.message || JSON.stringify(error)}`,
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

    async updateRegionRelations(relationship_manager_id, region) {
        try {
            const regionRelations = region.map(region_id => ({
                relationship_manager_id,
                region_id,
            }));

            await this.db
                .from(regionRelationsTableName)
                .delete()
                .eq("relationship_manager_id", relationship_manager_id);

            const { data, error } = await this.db
                .from(regionRelationsTableName)
                .insert(regionRelations)
                .select();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRMRegionRelations:", error);
            throw new Error(
                `Failed to update region RM relations: ${error.message || JSON.stringify(error)}`,
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
    async updateCategoryRelations(relationship_manager_id, category) {
        try {
            const categoryRelations = category.map(category_id => ({
                relationship_manager_id,
                category_id,
            }));

            await this.db
                .from(categoryRelationsTableName)
                .delete()
                .eq("relationship_manager_id", relationship_manager_id);

            const { data, error } = await this.db
                .from(categoryRelationsTableName)
                .insert(categoryRelations)
                .select();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateRMCategoryRelations:", error);
            throw new Error(
                `Failed to Update RM category relations: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getRelationshipManagersWithPagination(
        company_id,
        offset,
        limit,
        search,
        region_id_val,
        is_admin_rm,
        is_all,
    ) {
        try {
            // Build the query
            let passParams = {
                search_val: search || null,
                company_id_val: company_id || null,
                region_id_val: region_id_val || null,
                is_admin_rm: is_admin_rm || false,
            };
            console.log("passParams", passParams);

            let query = this.db.rpc("get_relationship_managers", passParams, {
                count: "exact",
            });

            // Apply pagination
            if (!is_all) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data, count, error } = await query
                .order("created_at", { ascending: false })
                .eq("is_delete", false);

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

    async deleteRelationshipManagerDatabase(rm_id) {
        try {
            const { error } = await this.db
                .from(relationshipManagerTableName)
                .update({
                    is_delete: true,
                })
                .eq("rm_id", rm_id)
                .select()
                .maybeSingle();

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Error in deleteRelationshipManagerDatabase:", error);
            throw new Error(
                `Failed to delete relationship manager: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getRelationshipManagerDetailsById(rm_id) {
        try {
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .select("*")
                .eq("rm_id", rm_id)
                .eq("is_delete", false)
                .maybeSingle();

            if (error) {
                console.error("Supabase error in getRelationshipManagerDetailsById:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in getRelationshipManagerDetailsById:", error);
            throw new Error(
                `Failed to fetch relationship manager details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async makeCredentialsRelationshipManagerDatabase(rm_id, email, password) {
        try {
            const { data, error } = await this.db
                .from(relationshipManagerTableName)
                .update({
                    email,
                    password,
                })
                .eq("rm_id", rm_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
}

module.exports = RelationshipManagerDatabase;
