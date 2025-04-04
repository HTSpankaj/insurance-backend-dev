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

    async getCategories(pageNumber, limit, is_all) {
        try {
            const { data, total } = await this.categoryDatabase.getCategories(
                pageNumber,
                limit,
                is_all,
            );
            return {
                success: true,
                data,
                metadata: {
                    total_count: total,
                    ...(!is_all
                        ? {
                              page: pageNumber,
                              per_page: limit,
                              // total_pages
                          }
                        : {}),
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

    async getCategoryListWithProductCounts(pageNumber, limit, is_all) {
        try {
            const { data, total } = await this.categoryDatabase.getCategoryListWithProductCounts(
                pageNumber,
                limit,
                is_all,
            );
            return {
                success: true,
                data,
                metadata: {
                    total_count: total,
                    ...(!is_all
                        ? {
                              page: pageNumber,
                              per_page: limit,
                              total_pages: Math.ceil(total / limit),
                          }
                        : {}),
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

    async updateCategoryService(category_id, title, description) {
        try {
            const category = await this.categoryDatabase.updateCategoryDatabase(
                category_id,
                title,
                description,
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

    async deleteCategoryService(category_id) {
        try {
            const category = await this.categoryDatabase.deleteCategoryDatabase(category_id);
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
