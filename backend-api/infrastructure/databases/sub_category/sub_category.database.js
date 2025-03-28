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

    async getSubCategories(id, pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*", { count: "exact" })
                .eq("category_id", id)
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

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

    async getAllSubCategoriesDatabase() {
        try {
            const { data, error } = await this.db
                .from("sub_category")
                .select("*, category:category_id(title)");
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch sub-categories: ${error.message}`);
        }
    }
}

module.exports = SubCategoryDatabase;
