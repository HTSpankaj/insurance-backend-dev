const CategoryDatabase = require("../../../infrastructure/databases/category/category.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage");

class CategoryService {
    /**
     * Constructor for initializing the CategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.categoryDatabase = new CategoryDatabase(supabaseInstance);
        this.configStorage = new BucketNameStorage(supabaseInstance, "config");
    }

    async createCategory(
        title,
        description,
        is_lead_add_without_product,
        file,
        created_by_user_id,
    ) {
        try {
            let category = await this.categoryDatabase.createCategory(
                title,
                description,
                is_lead_add_without_product,
                created_by_user_id,
            );

            if (file && category?.category_id) {
                category = await this.uploadCategoryLogo(category?.category_id, file);
            }

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

    async uploadCategoryLogo(category_id, file) {
        let updatedCategory = null;
        const fileExtension = file.mimetype.split("/")[1];
        const filePath = `category/${category_id}/logo.${fileExtension}`;

        const uploadFileResponse = await this.configStorage.uploadFile(
            filePath,
            file.buffer,
            file.mimetype,
            true,
        );
        if (uploadFileResponse) {
            const logo_url = await this.configStorage.getPublicUrl(
                uploadFileResponse?.path + "?" + new Date().getTime(),
            );
            updatedCategory = await this.categoryDatabase.updateCategoryDatabase(
                category_id,
                null,
                null,
                logo_url,
            );
        }
        return updatedCategory;
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

    async getCategoryListWithProductCounts(pageNumber, limit, is_all, search) {
        try {
            const { data, total } = await this.categoryDatabase.getCategoryListWithProductCounts(
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

    async updateCategoryService(category_id, title, description, file) {
        try {
            let category = await this.categoryDatabase.updateCategoryDatabase(
                category_id,
                title,
                description,
            );

            if (file && category_id) {
                category = await this.uploadCategoryLogo(category_id, file);
            }
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
