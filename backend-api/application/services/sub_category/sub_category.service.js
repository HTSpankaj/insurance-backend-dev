const SubCategoryDatabase = require("../../../infrastructure/databases/sub_category/sub_category.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage");

class SubCategoryService {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.subCategoryDatabase = new SubCategoryDatabase(supabaseInstance);
        this.configStorage = new BucketNameStorage(supabaseInstance, "config");
    }

    async createSubCategory(title, description, category_id, created_by_user_id, file) {
        try {
            let subCategory = await this.subCategoryDatabase.createSubCategory(
                title,
                description,
                category_id,
                created_by_user_id,
            );

            if (file && subCategory?.sub_category_id) {
                subCategory = await this.uploadCategoryLogo(subCategory?.sub_category_id, file);
            }
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

    async uploadCategoryLogo(sub_category_id, file) {
        let updatedSubCategory = null;
        const fileExtension = file.mimetype.split("/")[1];
        const filePath = `subcategory/${sub_category_id}/logo.${fileExtension}`;

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
            updatedSubCategory = await this.subCategoryDatabase.updateSubCategoryDatabase(
                sub_category_id,
                null,
                null,
                null,
                logo_url,
            );
        }
        return updatedSubCategory;
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

    async updateSubCategoryService(sub_category_id, category_id, title, description, file) {
        try {
            let subCategory = await this.subCategoryDatabase.updateSubCategoryDatabase(
                sub_category_id,
                category_id,
                title,
                description,
            );
            if (file && subCategory?.sub_category_id) {
                subCategory = await this.uploadCategoryLogo(subCategory?.sub_category_id, file);
            }
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
