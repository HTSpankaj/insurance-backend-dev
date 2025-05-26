const tableName = "sub_category";
const { SupabaseClient } = require("@supabase/supabase-js");

class SubCategoryDatabase {
    /**
     * Constructor for initializing the SubCategoryDatabase
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createSubCategory(title, description, category_id, created_by_user_id) {
        try {
            const existingSubCategory = await this.db
                .from(tableName)
                .select()
                .eq("title", title)
                .limit(1)
                .eq("is_delete", false);

            if (existingSubCategory?.error) throw error;
            if (existingSubCategory?.data?.length > 0) {
                throw new Error(
                    "Sub-category with same title already exists. Please choose a different title.",
                );
            }

            const { data, error } = await this.db
                .from(tableName)
                .insert({ title, description, category_id, created_by_user_id })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create sub-category: ${error.message}`);
        }
    }

    async getSubCategories(id, pageNumber, limit, is_all) {
        try {
            const offset = (pageNumber - 1) * limit;

            let query = this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .eq("category_id", id)
                .eq("is_delete", false)
                .order("created_at", { ascending: false });

            if (!is_all) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch sub-categories: ${error.message}`);
        }
    }

    async activeInactiveSubCategoryDatabase(sub_category_id, is_active) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_active: is_active })
                .eq("sub_category_id", sub_category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async getAllSubCategoriesDatabase(pageNumber, limit, is_all, search) {
        try {
            const offset = (pageNumber - 1) * limit;
            let query = this.db
                .from(tableName)
                .select("*, category:category_id(title)", { count: "exact" })
                .eq("is_delete", false)
                .order("created_at", { ascending: false });

            if (search && search.trim() !== "") {
                query = query.ilike("title", `%${search}%`);
            }

            if (!is_all && pageNumber && limit) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch sub-categories: ${error.message}`);
        }
    }

    async updateSubCategoryDatabase(sub_category_id, category_id, title, description, logo_url) {
        try {
            let postBody = {};
            if (category_id) postBody.category_id = category_id;
            if (title) postBody.title = title;
            if (description) postBody.description = description;
            if (logo_url) postBody.logo_url = logo_url;

            if (title) {
                const existingSubCategory = await this.db
                    .from(tableName)
                    .select()
                    .eq("title", title)
                    .limit(1)
                    .neq("sub_category_id", sub_category_id)
                    .eq("is_delete", false);

                if (existingSubCategory?.error) throw error;
                if (existingSubCategory?.data?.length > 0) {
                    throw new Error(
                        "Sub-category with same title already exists. Please choose a different title.",
                    );
                }
            }

            const { data, error } = await this.db
                .from(tableName)
                .update(postBody)
                .eq("sub_category_id", sub_category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async deleteSubCategoryDatabase(sub_category_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_delete: true })
                .eq("sub_category_id", sub_category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }
}

module.exports = SubCategoryDatabase;
