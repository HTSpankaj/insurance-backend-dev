const courseTableName = "course_module";

class CourseModuleDatabase {
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createModule(title, file_type, course_id, content) {
        const { data, error } = await this.db
            .from(courseTableName)
            .insert([{ title, file_type, course_id, content }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateModuleFile(moduleId, file_url) {
        const { error } = await this.db
            .from(courseTableName)
            .update({ file_url })
            .eq("id", moduleId);
        if (error) throw error;
    }
}

module.exports = CourseModuleDatabase;
