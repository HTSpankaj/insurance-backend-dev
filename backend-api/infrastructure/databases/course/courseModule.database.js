const { SupabaseClient } = require("@supabase/supabase-js");

const courseTableName = "course_module";

class CourseModuleDatabase {
     /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }
}

module.exports = CourseModuleDatabase;
