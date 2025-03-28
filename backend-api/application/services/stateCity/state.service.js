const { SupabaseClient } = require("@supabase/supabase-js");
const StateDatabase = require("../../../infrastructure/databases/stateCity/state.database");

class StateService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.stateDatabase = new StateDatabase(supabaseInstance);
    }

    async getStateService() {
        try {
            const { data, total } = await this.stateDatabase.getStateDatabase();

            return {
                list: data,
                total,
            };
        } catch (error) {
            return {
                message: error.message,
            };
        }
    }

    async getStateWithCityService() {
        try {
            const { data, total } = await this.stateDatabase.getStateWithCityDatabase();

            return {
                list: data,
                total,
            };
        } catch (error) {
            return {
                message: error.message,
            };
        }
    }

    async addStateService(title) {
        const state = await this.stateDatabase.addStateDatabase(title);
        return state;
    }

    async activeInactiveStateService(id, is_active) {
        const state = await this.stateDatabase.activeInactiveStateDatabase(id, is_active);
        return state;
    }
}

module.exports = StateService;
