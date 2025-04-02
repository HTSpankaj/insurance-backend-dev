const { SupabaseClient } = require("@supabase/supabase-js");

const courseTableName = "course";

class CourseDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createCourse(
        title,
        description,
        category_id,
        access_for_all_user,
        access_for_verified_user,
        availability_schedule,
        schedule_date,
        status,
    ) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .insert({
                    title,
                    description,
                    category_id,
                    access_for_all_user,
                    access_for_verified_user,
                    availability_schedule,
                    schedule_date,
                    status,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error in createCourse:", error);
            throw new Error("Failed to create course");
        }
    }

    async updateCourseBanner(course_id, course_banner_img_url) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .update({
                    course_banner_img_url: course_banner_img_url + "?" + Date.now(),
                })
                .eq("id", course_id)
                .select()
                .maybeSingle();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error("Error in updateCourseBanner:", error);
            throw new Error("Failed to update course banner URL");
        }
    }
}

module.exports = CourseDatabase;
