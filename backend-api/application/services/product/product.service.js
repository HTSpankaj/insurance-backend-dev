const ProductDatabase = require("../../../infrastructure/databases/product/product.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class ProductService {
    constructor(supabaseInstance) {
        this.productDatabase = new ProductDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "company");
    }

    async addProduct(
        product_name,
        sub_category_id,
        company_id,
        description,
        financial_description,
        product_tax,
        cover_amount_tax,
        is_publish,
        promotional_video_url,
        product_brochure_file,
        promotional_video_file,
        promotional_image_file,
    ) {
        try {
            // Insert into product table
            const product = await this.productDatabase.createProduct(
                product_name,
                sub_category_id,
                company_id,
                description,
                financial_description,
                product_tax,
                cover_amount_tax,
                is_publish,
            );

            await this.uploadSupportingDocuments(
                company_id,
                product.product_id,
                product_brochure_file,
                promotional_video_file || promotional_video_url,
                promotional_image_file,
            );

            return {
                ...product,
            };
        } catch (error) {
            throw new Error(`Failed to add product: ${error.message || JSON.stringify(error)}`);
        }
    }
    async updateProduct(
        product_id,
        product_name,
        sub_category_id,
        company_id,
        description,
        financial_description,
        product_tax,
        cover_amount_tax,
        is_publish,
        promotional_video_url,
        product_brochure_file,
        promotional_video_file,
        promotional_image_file,
    ) {
        try {
            // Insert into product table
            const product = await this.productDatabase.updateProduct(
                product_id,
                product_name,
                sub_category_id,
                company_id,
                description,
                financial_description,
                product_tax,
                cover_amount_tax,
                is_publish,
            );

            // Upload files to Supabase bucket

            await this.uploadSupportingDocuments(
                company_id,
                product_id,
                product_brochure_file,
                promotional_video_file || promotional_video_url,
                promotional_image_file,
            );

            return {
                ...product,
            };
        } catch (error) {
            throw new Error(`Failed to add product: ${error.message || JSON.stringify(error)}`);
        }
    }

    async uploadSupportingDocuments(
        company_id,
        product_id,
        product_brochure_file,
        promotional_video_file,
        promotional_image_file,
    ) {
        const uploadFile = async (file, fileName) => {
            const fileExtension = file.mimetype.split("/")[1];

            const filePath = `${company_id}/${product_id}/${fileName}.${fileExtension}`;
            const { error } = await this.storage.uploadFile(
                filePath,
                file.buffer,
                file.mimetype,
                true,
            );
            if (error) throw error;
            return this.storage.getPublicUrl(filePath);
        };

        let product_brochure_url = null;
        if (product_brochure_file) {
            product_brochure_url = await uploadFile(product_brochure_file, "brochure");
        }

        let promotional_video_url = null;
        if (typeof promotional_video_file === "string") {
            promotional_video_url = promotional_video_file;
        } else if (promotional_video_file) {
            promotional_video_url = await uploadFile(promotional_video_file, "video");
        }

        let promotional_image_url = null;
        if (promotional_image_file) {
            promotional_image_url = await uploadFile(promotional_image_file, "image");
        }

        // Insert file URLs into product_supporting_document table
        await this.productDatabase.upsertSupportingDocuments(
            product_id,
            product_brochure_url,
            promotional_video_url,
            promotional_image_url,
        );
    }

    async getProductListByCompanyId(
        company_id,
        pageNumber,
        limit,
        search,
        category_id,
        sub_category_id,
    ) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, total_count } = await this.productDatabase.getProductsWithPagination(
                company_id,
                offset,
                limit,
                search,
                category_id,
                sub_category_id,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                total_count,
                total_pages,
            };
        } catch (error) {
            console.error("Error in getProductListByCompanyId:", error);
            throw new Error(
                `Failed to fetch product list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getProductsByCategoryId(
        page_number,
        limit,
        category_id,
        sub_category_id,
        search,
        is_company_publish,
        is_product_publish,
    ) {
        try {
            const { data, total_count } = await this.productDatabase.getProductsByCategoryId(
                page_number,
                limit,
                category_id,
                sub_category_id,
                null,
                search,
                is_company_publish,
                is_product_publish,
            );
            const total_pages = Math.ceil(total_count / limit);
            return { data, total_count, total_pages };
        } catch (error) {
            throw new Error(
                `Failed to fetch products by category: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getProductByProductIdService(product_id) {
        return await this.productDatabase.getProductsByCategoryId(
            1,
            1,
            null,
            null,
            product_id,
            null,
            null,
            null,
        );
    }

    async deleteProductByIdService(product_id) {
        return await this.productDatabase.deleteProductByIdDatabase(product_id);
    }
}

module.exports = ProductService;
