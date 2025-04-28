const { SupabaseClient } = require("@supabase/supabase-js");

const productTableName = "products";
const supportingDocTableName = "product_supporting_document";

class ProductDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createProduct(
        product_name,
        sub_category_id,
        company_id,
        description,
        financial_description,
        is_publish,
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
                    is_publish,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message || JSON.stringify(error)}`);
        }
    }

    async updateProduct(
        product_id,
        product_name,
        sub_category_id,
        company_id,
        description,
        financial_description,
        is_publish,
    ) {
        try {
            let postBody = {};
            if(product_name)
                postBody.product_name = product_name;
            if(sub_category_id)
                postBody.sub_category_id = sub_category_id;
            if(company_id)
                postBody.company_id = company_id;
            if(description)
                postBody.description = description;
            if(financial_description)
                postBody.financial_description = financial_description;
            if(is_publish === true || is_publish === false)
                postBody.is_publish = is_publish;

            const { data, error } = await this.db
                .from(productTableName)
                .update(postBody)
                .eq("product_id", product_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message || JSON.stringify(error)}`);
        }
    }

    async upsertSupportingDocuments(
        product_id,
        product_brochure_url,
        promotional_video_url,
        promotional_image_url,
    ) {
        try {

            let postBody = {product_id: product_id};
            if(product_brochure_url)
                postBody.product_brochure_url = product_brochure_url;
            if(promotional_video_url)
                postBody.promotional_video_url = promotional_video_url;
            if(promotional_image_url)
                postBody.promotional_image_url = promotional_image_url;

            const { data, error } = await this.db
                .from(supportingDocTableName)
                .upsert(postBody, {onConflict: "product_id"})
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
        company_id = null,
        offset,
        limit,
        search = null,
        category_id = null,
        sub_category_id = null,
    ) {
        try {
            let query = this.db.rpc(
                "get_product_list",
                {
                    company_id_val: company_id || null,
                    search_val: search || null,
                    category_id_val: category_id || null,
                    sub_category_id_val: sub_category_id || null,
                },
                { count: "exact" },
            );

            // Apply pagination
            query = query
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            const { data, count, error } = await query;

            if (error) {
                console.error("Supabase error in getProductsWithPagination:", error);
                throw error;
            }

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
            const { data, error } = await this.db.rpc("get_products_by_category_id", {
                p_page_number: page_number,
                p_limit: limit,
                p_category_id: category_id || null,
                p_sub_category_id: sub_category_id || null,
                p_search: search || null,
                p_is_company_publish: is_company_publish || null,
                p_is_product_publish: is_product_publish || null,
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

    async deleteProductByIdDatabase(product_id) {
        try {
            
            const {data, error} = await this.db.from(productTableName).update({
                is_delete: true
            }).eq("product_id", product_id).select("*").maybeSingle();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(
                `Failed to delete products by product id: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = ProductDatabase;
