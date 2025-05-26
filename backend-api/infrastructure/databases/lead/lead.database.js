const leadProductRelationTableName = "lead_product_relation";
const leadTableName = "lead";
const { SupabaseClient } = require("@supabase/supabase-js");

const leadStatusEnum = [
    { id: 1, title: "New" },
    { id: 2, title: "Assigned" },
    { id: 3, title: "Sold" },
    { id: 4, title: "Lost" },
];

class LeadDatabase {
    /**
     * Constructor for initializing the SubCategoryService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    // lead.database.js
    async getLeadsWithPagination(
        pageNumber,
        limit,
        search,
        status,
        priority,
        category_id,
        company_id,
        advisor_id = null,
    ) {
        try {
            const offset = (pageNumber - 1) * limit;

            // console.log({offset, limit_val});

            let _status = null;
            if (status && leadStatusEnum?.find(item => item?.title === status)) {
                _status = leadStatusEnum.find(item => item?.title === status)?.id;
            }

            console.log({ offset });

            const { data, error, count } = await this.db.rpc(
                "get_lead_product_relations",
                {
                    offset_val: offset,
                    limit_val: limit,
                    search_val: search,
                    status_val: _status,
                    priority_val: priority,
                    category_id_val: category_id,
                    company_id_val: company_id,
                    advisor_id_val: advisor_id || null,
                },
                {
                    count: "exact",
                },
            );

            if (error) {
                console.error("Supabase error in get_lead_product_relations (data):", error);
                throw error;
            }

            return {
                data: data || [],
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in get_lead_product_relations:", error);
            throw new Error(`Failed to fetch leads: ${error.message || JSON.stringify(error)}`);
        }
    }

    async createLead(name, email, contact_number, dob, address, city_id) {
        try {
            console.log("Inserting into lead table:", {
                name,
                email,
                contact_number,
                dob,
                address,
                city_id,
            });
            const { data, error } = await this.db
                .from(leadTableName)
                .insert({
                    name,
                    email,
                    contact_number,
                    dob,
                    address,
                    city_id,
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createLead:", error);
                throw error;
            }
            console.log("Lead insert result:", data);
            return data;
        } catch (error) {
            console.error("Error in createLead:", error);
            throw new Error(`Failed to create lead: ${error.message || JSON.stringify(error)}`);
        }
    }

    async createLeadProductRelation(lead_id, product_id, advisor_id, priority, additional_note) {
        try {
            console.log("Inserting into lead_product_relation table:", {
                lead_id,
                product_id,
                advisor_id,
                priority,
                additional_note,
            });
            const { data, error } = await this.db
                .from(leadProductRelationTableName)
                .insert({
                    lead_id,
                    product_id,
                    advisor_id,
                    priority,
                    additinal_note: additional_note,
                    lead_status_id: 1,
                })
                .select(
                    `*, 
                    product_id(
                        product_name, company_id(company_id, company_name),
                        sub_category_id(sub_category_id, title, category_id(category_id, title))
                    ),
                    lead_id(lead_id, name, email, contact_number, city_id(id, title, state_id(id, title)))
                `,
                )
                .maybeSingle();

            if (error) {
                console.error("Supabase error in createLeadProductRelation:", error);
                throw error;
            }
            console.log("Lead product relation insert result:", data);
            return data;
        } catch (error) {
            console.error("Error in createLeadProductRelation:", error);
            throw new Error(
                `Failed to create lead product relation: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getTotalLeadCount() {
        try {
            const { count, error } = await this.db
                .from(leadProductRelationTableName)
                .select("*", { count: "exact", head: true })
                .limit(1);

            if (error) {
                console.error("Supabase error in getTotalLeadCount:", error);
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error("Error in getTotalLeadCount:", error);
            throw new Error(
                `Failed to fetch total lead count: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getNewLeadCount() {
        try {
            const { count, error } = await this.db
                .from(leadProductRelationTableName)
                .select("*", { count: "exact", head: true })
                .eq("lead_status_id", 1) // Assuming 1 = New
                .limit(1);

            if (error) {
                console.error("Supabase error in getNewLeadCount:", error);
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error("Error in getNewLeadCount:", error);
            throw new Error(
                `Failed to fetch new lead count: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getAssignedLeadCount() {
        try {
            const { count, error } = await this.db
                .from(leadProductRelationTableName)
                .select("*", { count: "exact", head: true })
                .eq("lead_status_id", 2) // Assuming 2 = Assigned
                .limit(1);

            if (error) {
                console.error("Supabase error in getAssignedLeadCount:", error);
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error("Error in getAssignedLeadCount:", error);
            throw new Error(
                `Failed to fetch assigned lead count: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getConvertedLeadCount() {
        try {
            const { count, error } = await this.db
                .from(leadProductRelationTableName)
                .select("*", { count: "exact", head: true })
                .eq("lead_status_id", 3) // Assuming 3 = Converted (Sold)
                .limit(1);

            if (error) {
                console.error("Supabase error in getConvertedLeadCount:", error);
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error("Error in getConvertedLeadCount:", error);
            throw new Error(
                `Failed to fetch converted lead count: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getLostLeadCount() {
        try {
            const { count, error } = await this.db
                .from(leadProductRelationTableName)
                .select("*", { count: "exact", head: true })
                .eq("lead_status_id", 4) // Assuming 4 = Lost
                .limit(1);

            if (error) {
                console.error("Supabase error in getLostLeadCount:", error);
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error("Error in getLostLeadCount:", error);
            throw new Error(
                `Failed to fetch lost lead count: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getLeadByDisplayId(lead_display_id) {
        const { data, error } = await this.db
            .from(leadTableName)
            .select("*")
            .eq("lead_display_id", lead_display_id)
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
}

module.exports = LeadDatabase;
