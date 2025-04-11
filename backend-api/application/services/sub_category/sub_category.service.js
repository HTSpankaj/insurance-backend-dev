const SubCategoryDatabase = require("../../../infrastructure/databases/sub_category/sub_category.database");

class SubCategoryService {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.subCategoryDatabase = new SubCategoryDatabase(supabaseInstance);
    }

    async createSubCategory(title, description, category_id, created_by_user_id) {
        try {
            const subCategory = await this.subCategoryDatabase.createSubCategory(
                title,
                description,
                category_id,
                created_by_user_id,
            );
            return {
                success: true,
                data: subCategory,
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

    async getSubCategories(id, pageNumber, limit, is_all) {
        try {
            const { data, total } = await this.subCategoryDatabase.getSubCategories(
                id,
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

    async activeInactiveSubCategoryService(sub_category_id, is_active) {
        try {
            const category = await this.subCategoryDatabase.activeInactiveSubCategoryDatabase(
                sub_category_id,
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

    async getAllSubCategoriesService(pageNumber, limit, is_all, search) {
        try {
            const { data, total } = await this.subCategoryDatabase.getAllSubCategoriesDatabase(
                pageNumber,
                limit,
                is_all,
                search,
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

    async updateSubCategoryService(sub_category_id, category_id, title, description) {
        try {
            const subCategory = await this.subCategoryDatabase.updateSubCategoryDatabase(
                sub_category_id,
                category_id,
                title,
                description,
            );
            return {
                success: true,
                data: subCategory,
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

    async deleteSubCategoryService(sub_category_id) {
        try {
            const subCategory =
                await this.subCategoryDatabase.deleteSubCategoryDatabase(sub_category_id);
            return {
                success: true,
                data: subCategory,
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

module.exports = SubCategoryService;
