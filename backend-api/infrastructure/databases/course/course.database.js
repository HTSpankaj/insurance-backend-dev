const courseTableName = "course";

class CourseDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createCourse(
        title,
        description,
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

    async updateCourseBanner(category_id, course_banner_img_url) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .insert({
                    category_id,
                    course_banner_img_url,
                })
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
