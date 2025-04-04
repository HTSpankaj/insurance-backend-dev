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

    async getAllSubCategoriesDatabase(pageNumber, limit, is_all) {
        try {
            const offset = (pageNumber - 1) * limit;
            let query = this.db
                .from("sub_category")
                .select("*, category:category_id(title)", { count: "exact" })
                .eq("is_delete", false)
                .order("created_at", { ascending: false });

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

    async updateSubCategoryDatabase(sub_category_id, category_id, title, description) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ title: title, description: description, category_id: category_id })
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
