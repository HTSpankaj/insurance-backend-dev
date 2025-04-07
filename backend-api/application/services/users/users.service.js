const { hash } = require("bcrypt");
var { encryptPassword, decryptPassword } = require("../../../utils/crypto.util");
const UsersDatabase = require("../../../infrastructure/databases/users/users.database");
const { SupabaseClient } = require("@supabase/supabase-js");

class UserService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.usersDatabase = new UsersDatabase(supabaseInstance);
    }

    /**
     * Logs in a user by verifying the email and password.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's plaintext password.
     * @returns {Object} The user data if login is successful.
     * @throws {Error} If the password is incorrect or if the user does not exist.
     */

    async login(email, password) {
        const user = await this.usersDatabase.login(email);
        if (user) {
            var decryptedPassword = decryptPassword(user.password);

            if (decryptedPassword === password) {
                return user;
            } else {
                let err = { message: "Password wrong!" };
                throw err;
            }
        }
    }

    async getUserByUserId(user_id) {
        const user = await this.usersDatabase.getUserByUserId(user_id);
        if (user) {
            delete user.password;
            return user;
        }
    }
    //------------------------------------------------------
    // New createUser method
    async createUser(email, password, first_name, middle_name, last_name, contact_number, role_id) {
        try {
            const encryptedPassword = encryptPassword(password); // Encrypt password before saving
            const user = await this.usersDatabase.createUser(
                email,
                encryptedPassword,
                first_name,
                middle_name,
                last_name,
                contact_number,
                role_id,
            );
            delete user.password;
            return user; // Return user data without password
        } catch (error) {
            throw new Error(error.message || "Failed to create user");
        }
    }

    // New getUsers method
    async getUsers(pageNumber, limit) {
        try {
            const { data, total } = await this.usersDatabase.getUsers(pageNumber, limit);
            // Remove password from each user in the response
            const sanitizedData = data.map(user => {
                delete user.password;
                return user;
            });
            return {
                users: sanitizedData,
                total,
                page: pageNumber,
                limit,
            };
        } catch (error) {
            throw new Error(error.message || "Failed to fetch users");
        }
    }
    // New method to update user
    async updateUser(user_id, first_name, middle_name, last_name, contact_number) {
        try {
            const updatedUser = await this.usersDatabase.updateUser(
                user_id,
                first_name,
                middle_name,
                last_name,
                contact_number,
            );
            delete updatedUser.password; // Remove password from response
            return updatedUser;
        } catch (error) {
            throw new Error(error.message || "Failed to update user");
        }
    }
    // New method to soft-delete a user
    async deleteUser(user_id) {
        try {
            const deletedUser = await this.usersDatabase.deleteUser(user_id);
            delete deletedUser.password; // Remove password from response
            return deletedUser;
        } catch (error) {
            throw new Error(error.message || "Failed to delete user");
        }
    }
}
//---------------------------------------

module.exports = { UserService };
