const leadProductRelationTableName = "lead_product_relation";
const leadTableName = "lead";
const { SupabaseClient } = require("@supabase/supabase-js");

class LeadDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    // lead.database.js
    async getLeadsWithPagination(offset, limit) {
        try {
            // Fetch total count
            const { count, error: countError } = await this.db
                .from("lead_product_relation")
                .select("*", { count: "exact", head: true });

            if (countError) {
                console.error("Supabase error in getLeadsWithPagination (count):", countError);
                throw countError;
            }

            // Fetch paginated data with corrected joins
            const { data, error } = await this.db
                .from("lead_product_relation")
                .select(
                    `
                lead:lead_id (
                    name
                ),
                product:product_id (
                    product_name,
                    company:company_id (
                        company_name
                    )
                ),
                relationship_managers:advisor_id (
                    name
                ),
                lead_status:lead_status_id (
                    title
                ),
                priority,
                created_at
            `,
                )
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error("Supabase error in getLeadsWithPagination (data):", error);
                throw error;
            }

            // Transform the data to flatten the structure
            const transformedData = data.map(item => ({
                leadname: item.lead?.name,
                product_name: item.product?.product_name,
                companyname: item.product?.company?.company_name,
                relationship_manager: item.relationship_managers?.name, // Use 'name' directly
                priority: item.priority,
                status: item.lead_status?.title,
                lead_id: item.lead_id,
                product_id: item.product_id,
                advisor_id: item.advisor_id,
                created_at: item.created_at,
            }));

            console.log("Fetched leads:", transformedData);
            return {
                data: transformedData || [],
                total_count: count || 0,
            };
        } catch (error) {
            console.error("Error in getLeadsWithPagination:", error);
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
                .select()
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
