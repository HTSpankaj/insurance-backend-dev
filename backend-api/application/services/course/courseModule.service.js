const CourseDatabase = require("../../../infrastructure/databases/course/courseModule.database.js");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class CourseService {
    constructor(supabaseInstance) {
        this.courseDatabase = new CourseDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "courses");
    }

    async addCourseModule(title, file_type, course_id, content, file) {
        try {
            // Step 1: Insert the course module into the database
            const courseModule = await this.courseDatabase.addCourseModule(
                course_id,
                title,
                file_type,
                content,
            );

            if (!courseModule || !courseModule.id) {
                throw new Error("Failed to create course module");
            }
            console.log("Service - Course module created:", courseModule);

            // Step 2: Upload the file to storage if provided
            let fileUrl = null;
            if (file) {
                const fileExtension =
                    file.mimetype === "application/pdf"
                        ? "pdf"
                        : file.mimetype.startsWith("image/")
                          ? "jpg"
                          : file.mimetype.startsWith("video/")
                            ? "mp4"
                            : "txt";
                const fileName = `${file.originalname.split(".")[0]}.${fileExtension}`;
                const filePath = `course_module/${course_id}/${courseModule.id}/${fileName}`;

                console.log("Service - Uploading file to:", filePath);
                console.log("Service - File details:", {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                });

                const { data, error } = await this.storage.uploadFile(
                    filePath,
                    file.buffer,
                    file.mimetype,
                    false,
                );
                if (error) {
                    console.error("Service - Upload error:", error);
                    throw new Error(`Upload failed: ${error.message}`);
                }
                console.log("Service - Upload successful:", data);

                fileUrl = await this.storage.getPublicUrl(filePath);
                console.log("Service - Generated fileUrl:", fileUrl);
            } else {
                console.log("Service - No file provided");
            }

            // Step 3: Update the course module with the file URL
            const updatedModule = await this.courseDatabase.updateCourseModuleFileUrl(
                courseModule.id,
                fileUrl,
            );
            console.log("Service - Updated module:", updatedModule);

            return updatedModule;
        } catch (error) {
            console.error("Error in addCourseModule:", error);
            throw new Error(
                `Failed to add course module: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async updateCourseModule(id, title, file_type, content, is_active, is_delete, file) {
        try {
            let courseModule = await this.courseDatabase.updateCourseModule(
                id,
                file_type,
                content,
                is_active,
                is_delete,
            );

            if (!courseModule || !courseModule.id) {
                throw new Error("Failed to update course module");
            }

            // Step 2: Upload the file to storage if provided
            let fileUrl = null;
            if (file) {
                const fileExtension =
                    file.mimetype === "application/pdf"
                        ? "pdf"
                        : file.mimetype.startsWith("image/")
                          ? "jpg"
                          : file.mimetype.startsWith("video/")
                            ? "mp4"
                            : "txt";
                const fileName = `${file.originalname.split(".")[0]}.${fileExtension}`;
                const filePath = `course_module/${course_id}/${courseModule.id}/${fileName}`;

                console.log("Service - Uploading file to:", filePath);
                console.log("Service - File details:", {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                });

                const { data, error } = await this.storage.uploadFile(
                    filePath,
                    file.buffer,
                    file.mimetype,
                    true,
                );
                if (error) {
                    console.error("Service - Upload error:", error);
                    throw new Error(`Upload failed: ${error.message}`);
                }
                // console.log("Service - Upload successful:", data);

                fileUrl = await this.storage.getPublicUrl(filePath);
                console.log("Service - Generated fileUrl:", fileUrl);

                courseModule = await this.courseDatabase.updateCourseModuleFileUrl(
                    courseModule.id,
                    fileUrl,
                );
            }

            return courseModule;
        } catch (error) {
            console.error("Error in addCourseModule:", error);
            throw new Error(
                `Failed to add course module: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    // New method to get course modules
    async getCourseModules(courseId) {
        try {
            const modules = await this.courseDatabase.getCourseModules(courseId);
            return modules;
        } catch (error) {
            console.error("Error in getCourseModules:", error);
            throw new Error(
                `Failed to fetch course modules: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = CourseService;
