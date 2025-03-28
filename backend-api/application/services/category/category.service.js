/*st CategoryDatabase = require("../../../infrastructure/databases/category/category.database");
const { SupabaseClient } = require("@supabase/supabase-js");

class CategoryService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
/*nstructor(supabaseInstance) {
        this.categoryDatabase = new CategoryDatabase(supabaseInstance);
    }

    async addCategoryService(payload) {
        const categoryRes = await this.categoryDatabase.addCategoryDb(payload);
        if (categoryRes) {
            return categoryRes;
        }
    }
}

module.exports = { CategoryService };*/

const CategoryDatabase = require("../../../infrastructure/databases/category/category.database");

class CategoryService {
    /**
     * Constructor for initializing the CategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.categoryDatabase = new CategoryDatabase(supabaseInstance);
    }

    async createCategory(title, description) {
        try {
            const category = await this.categoryDatabase.createCategory(title, description);
            return {
                success: true,
                data: category,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }

    async getCategories(pageNumber, limit) {
        try {
            const { data, total } = await this.categoryDatabase.getCategories(pageNumber, limit);
            return {
                success: true,
                data: {
                    categories: data,
                    total,
                    page: pageNumber,
                    limit,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }

    async getCategoriesWithSubCategories(pageNumber, limit) {
        try {
            const { data, total } = await this.categoryDatabase.getCategoriesWithSubCategories(
                pageNumber,
                limit,
            );
            return {
                success: true,
                data: {
                    categories: data,
                    total,
                    page: pageNumber,
                    limit,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }

    async getCategoryListWithProductCounts() {
        try {
            const { data, total } = await this.categoryDatabase.getCategoryListWithProductCounts();
            return {
                success: true,
                data: {
                    categories: data,
                    total,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }

    async activeInactiveCategoryService(category_id, is_active) {
        try {
            const category = await this.categoryDatabase.activeInactiveCategoryDatabase(
                category_id,
                is_active,
            );
            return {
                success: true,
                data: category,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }
}

module.exports = CategoryService;
