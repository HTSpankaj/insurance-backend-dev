const productTableName = "products";
const supportingDocTableName = "product_supporting_document";

class ProductDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createProduct(
        product_name,
        sub_category_id,
        company_id,
        description,
        financial_description,
    ) {
        try {
            const { data, error } = await this.db
                .from(productTableName)
                .insert({
                    product_name,
                    sub_category_id,
                    company_id,
                    description,
                    financial_description,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message || JSON.stringify(error)}`);
        }
    }

    async createSupportingDocuments(
        product_id,
        product_brochure_url,
        promotional_video_url,
        promotional_image_url,
    ) {
        try {
            const { data, error } = await this.db
                .from(supportingDocTableName)
                .insert({
                    product_id,
                    product_brochure_url,
                    promotional_video_url,
                    promotional_image_url,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to insert supporting documents: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    async getProductsWithPagination(
        company_id,
        offset,
        limit,
        search,
        category_id,
        sub_category_id,
    ) {
        try {
            // Build the query
            let query = this.db
                .from(productTableName)
                .select("*, sub_category_id", { count: "exact" })
                .eq("company_id", company_id);

            // Apply filters
            if (search) {
                query = query.ilike("name", `%${search}%`);
            }
            if (category_id) {
                query = query.eq("category_id", category_id);
            }
            if (sub_category_id) {
                query = query.eq("sub_category_id", sub_category_id);
            }

            // Apply pagination
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getProductsWithPagination:", error);
                throw error;
            }

            console.log("Fetched products:", data);
            return {
                data: data || [],
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getProductsWithPagination:", error);
            throw new Error(`Failed to fetch products: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getProductByDisplayIdCompanyId(product_display_id, company_id) {
        const { data, error } = await this.db
            .from(productTableName)
            .select("*")
            .eq("product_display_id", product_display_id)
            .eq("company_id", company_id)
            .maybeSingle();

        if (data) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error,
            };
        }
    }

    async getProductsByCategoryId(page_number, limit, category_id, sub_category_id, search) {
        try {
            const { data, error } = await this.db.rpc("get_products_by_category_id", {
                p_page_number: page_number,
                p_limit: limit,
                p_category_id: category_id || null,
                p_sub_category_id: sub_category_id || null,
                p_search: search || null,
            });

            if (error) throw error;

            const total_count = data.length > 0 ? data[0].total_count : 0;
            return { data, total_count };
        } catch (error) {
            throw new Error(
                `Failed to fetch products by category ID: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = ProductDatabase;
