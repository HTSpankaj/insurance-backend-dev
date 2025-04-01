const CourseModuleDatabase = require("../../../infrastructure/databases/course/courseModule.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class CourseModuleService {
    constructor(supabaseInstance) {
        this.courseModuleDatabase = new CourseModuleDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "courses"); // Bucket named 'course-modules'
    }

    async addCourseModule(title, file_type, course_id, content, file) {
        try {
            const module = await this.courseModuleDatabase.createModule(
                title,
                file_type,
                course_id,
                content,
            );

            console.log("Created Module:", module);

            if (!module || !module.id) {
                throw new Error("Module creation failed");
            }

            let file_url = null;
            const fileExtension = file.mimetype.split("/")[1];
            const filePath = `modules/${module.id}/file.${fileExtension}`;

            console.log("Uploading file to:", filePath);
            const { data, error } = await this.storage.uploadFile(
                filePath,
                file.buffer,
                file.mimetype,
            );
            if (error) throw error;

            file_url = this.storage.getPublicUrl(filePath);

            await this.courseModuleDatabase.updateModuleFile(module.id, file_url);

            return { ...module, file_url };
        } catch (error) {
            console.error("Error in addCourseModule:", error);
            throw new Error(`Failed to add course module: ${error.message}`);
        }
    }
}

module.exports = CourseModuleService;
