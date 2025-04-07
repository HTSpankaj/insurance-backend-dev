const { SupabaseClient } = require("@supabase/supabase-js");
const RolesDatabase = require("../../../infrastructure/databases/roles/roles.database");

class RolesService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.rolesDatabase = new RolesDatabase(supabaseInstance);
    }

    async createRole(title, access) {
        try {
            const role = await this.rolesDatabase.createRole(title, access);
            return {
                success: true,
                data: role,
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

    async getRoles(pageNumber, limit) {
        try {
            const { data, total } = await this.rolesDatabase.getRoles(pageNumber, limit);
            return {
                success: true,
                data: {
                    roles: data,
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

    // New method to update a role
    async updateRole(role_id, title, access) {
        try {
            const role = await this.rolesDatabase.updateRole(role_id, title, access);
            return {
                success: true,
                data: role,
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

    // New method to soft-delete a role
    async deleteRole(role_id) {
        try {
            const role = await this.rolesDatabase.deleteRole(role_id);
            return {
                success: true,
                data: role,
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

module.exports = RolesService;
