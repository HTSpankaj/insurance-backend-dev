const tableName = "user";
const { SupabaseClient } = require("@supabase/supabase-js");
//console.log('Supabase client:', supabase);
class UsersDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    /**
     * Logs in a user
     * @param {string} email - The user email
     * @returns {Object} The user data
     * @throws {Error} If the login fails
     */
    async login(email) {
        try {
            const queryResponse = await this.db
                .from(tableName)
                .select("*, role:role_id(*)")
                .eq("email", email)
                .maybeSingle();
            console.log(queryResponse);

            if (queryResponse?.data) {
                return queryResponse?.data;
            }
            if (queryResponse?.error) {
                throw queryResponse?.error;
            } else {
                let err = { message: "email wrong!" };
                throw err;
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserByUserId(user_id) {
        const { data, error } = await this.db
            .from(tableName)
            .select("*, role:role_id(*)")
            .eq("user_id", user_id)
            .maybeSingle();
        if (data) {
            return data;
        } else {
            throw error;
        }
    }

    //---------------------------------------

    // New createUser method
    async createUser(email, password, first_name, middle_name, last_name, contact_number, role_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({
                    email,
                    password,
                    first_name,
                    middle_name,
                    last_name,
                    contact_number,
                    role_id,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    // New getUsers method
    async getUsers(pageNumber, limit) {
        try {
            const offset = (pageNumber - 1) * limit;
            const { data, error, count } = await this.db
                .from(tableName)
                .select("*, relationship_managers(*)", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return { data, total: count };
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
    // New method to update user details
    async updateUser(user_id, first_name, middle_name, last_name, contact_number) {
        try {
            const updates = {};
            if (first_name !== undefined) updates.first_name = first_name;
            if (middle_name !== undefined) updates.middle_name = middle_name;
            if (last_name !== undefined) updates.last_name = last_name;
            if (contact_number !== undefined) updates.contact_number = contact_number;

            const { data, error } = await this.db
                .from(tableName)
                .update(updates)
                .eq("user_id", user_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("User not found");

            return data;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message || JSON.stringify(error)}`);
        }
    }

    // New method to soft-delete a user
    async deleteUser(user_id) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ is_delete: true })
                .eq("user_id", user_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("User not found");

            return data;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message || JSON.stringify(error)}`);
        }
    }
}

module.exports = UsersDatabase;
