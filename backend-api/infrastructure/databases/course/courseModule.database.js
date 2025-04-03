const tableName = "course_module";

class CourseDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addCourseModule(course_id, title, file_type, content) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .insert({
                    course_id,
                    title,
                    file_type,
                    content,
                })
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in addCourseModule:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in addCourseModule:", error);
            throw new Error(
                `Failed to add course module: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateCourseModuleFileUrl(course_module_id, file_url) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .update({ file_url })
                .eq("id", course_module_id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in updateCourseModuleFileUrl:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error in updateCourseModuleFileUrl:", error);
            throw new Error(`Failed to update file URL: ${error.message || JSON.stringify(error)}`);
        }
    }

    // New method to get course modules list
    async getCourseModules(courseId) {
        try {
            const { data, error } = await this.db
                .from(tableName)
                .select("*")
                .eq("course_id", courseId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Supabase error in getCourseModules:", error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error("Error in getCourseModules:", error);
            throw new Error(
                `Failed to fetch course modules: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = CourseDatabase;
