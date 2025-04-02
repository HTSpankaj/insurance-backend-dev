const CourseDatabase = require("../../../infrastructure/databases/course/course.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class CourseService {
    constructor(supabaseInstance) {
        this.courseDatabase = new CourseDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "courses"); // Bucket named 'courses'
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
        course_banner_img_file,
    ) {
        try {
            // Insert into course table
            let createCourseResponse = await this.courseDatabase.createCourse(
                title,
                description,
                category_id,
                access_for_all_user,
                access_for_verified_user,
                availability_schedule,
                schedule_date,
                status,
            );

            if (!createCourseResponse || !createCourseResponse.id) {
                throw new Error("Course creation failed");
            }

            if (course_banner_img_file) {
                const fileExtension = course_banner_img_file.mimetype.split("/")[1];
                const filePath = `courses/${createCourseResponse.id}/banner.${fileExtension}`;

                console.log("Uploading file to:", filePath);
                const uploadFileResponse = await this.storage.uploadFile(
                    filePath,
                    course_banner_img_file.buffer,
                    course_banner_img_file.mimetype,
                );
                if (uploadFileResponse) {
                    const banner_url = await this.storage.getPublicUrl(uploadFileResponse?.path);
                    createCourseResponse = await this.courseDatabase.updateCourseBanner(
                        createCourseResponse?.id,
                        banner_url,
                    );
                }
            }

            return createCourseResponse;
        } catch (error) {
            console.error("Error in createCourse:", error);
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }
}

module.exports = CourseService;
