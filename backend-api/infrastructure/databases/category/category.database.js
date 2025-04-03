/*nst tableName = "category";
const { SupabaseClient } = require("@supabase/supabase-js");

class categoryDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
/*nstructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addCategoryDb(payload) {
        const { data, error } = await this.db.from(tableName).insert(payload).maybeSingle();
        if (data) {
            return data;
        } else {
            throw error;
        }
    }
}

module.exports = categoryDatabase;*/

const tableName = "category";
const { SupabaseClient } = require("@supabase/supabase-js");

class CategoryDatabase {
    /**
     * Constructor for initializing the CategoryDatabase
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createCategory(title, description) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({ title, description }) // Include description
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    async getCategories(pageNumber, limit, is_all) {
        try {
            const offset = (pageNumber - 1) * limit;
            let query = this.db
            .from(tableName)
            .select("*", { count: "exact" })
            .eq("is_delete", false)
            .order("created_at", { ascending: false })
            
            if (!is_all) {
                query = query.range(offset, offset + limit - 1);
                
            }
            
            const { data, error, count } = await query;

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async getCategoriesWithSubCategories(pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*, sub_category(*)", { count: "exact" })
                .eq("is_delete", false)
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async getCategoryListWithProductCounts() {
        try {
            const { data, error, count } = await this.db
                .rpc("get_category_list_with_counts", {})
                .select("*", { count: "exact" });

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async activeInactiveCategoryDatabase(category_id, is_active) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_active: is_active })
                .eq("category_id", category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async updateCategoryDatabase(category_id, title, description) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ title: title, description: description })
                .eq("category_id", category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async deleteCategoryDatabase(category_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_delete: true })
                .eq("category_id", category_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }
}

module.exports = CategoryDatabase;
