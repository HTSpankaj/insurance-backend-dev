const { SupabaseClient } = require("@supabase/supabase-js");

const TableName = "invoice_scheduler_config";

class InvoiceSchedulerConfigDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getAllInvoiceSchedularConfigDatabase() {
        try {
            const { data, error } = await this.db
                .from(TableName)
                .select("*")
                .eq("is_delete", false)
                .order("created_at", { ascending: false });
            if (data) {
                return data;
            } else {
                throw error;
            }
        } catch (error) {
            throw new Error(`Failed to get invoice schedular config: ${error.message}`);
        }
    }

    async InsertInvoiceSchedularConfigDatabase(date, time, acceptance_time_period) {
        try {
            const { data, error } = await this.db
                .from(TableName)
                .insert({ date, time, acceptance_time_period })
                .select("*")
                .maybeSingle();
            if (data) {
                return data;
            } else {
                throw error;
            }
        } catch (error) {
            throw new Error(`Failed to insert invoice schedular config: ${error.message}`);
        }
    }

    async UpdateInvoiceSchedularConfigDatabase(id, date, time, acceptance_time_period, is_active) {
        try {
            let postBody = {};
            if (date) postBody.date = date;
            if (time) postBody.time = time;
            if (acceptance_time_period) postBody.acceptance_time_period = acceptance_time_period;
            if (is_active === true || is_active === false) postBody.is_active = is_active;

            const { data, error } = await this.db
                .from(TableName)
                .update(postBody)
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update invoice schedular config: ${error.message}`);
        }
    }

    async DeleteInvoiceSchedularConfigDatabase(id) {
        try {
            const { data, error } = await this.db
                .from(TableName)
                .update({ is_delete: true })
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to delete invoice schedular config: ${error.message}`);
        }
    }
}

module.exports = InvoiceSchedulerConfigDatabase;
