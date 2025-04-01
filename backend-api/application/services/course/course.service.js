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
            const course = await this.courseDatabase.createCourse(
                title,
                description,
                // category_id,
                access_for_all_user,
                access_for_verified_user,
                availability_schedule,
                schedule_date,
                status,
            );

            if (!course || !course.id) {
                throw new Error("Course creation failed");
            }

            let banner_url = null;

            const fileExtension = course_banner_img_file.mimetype.split("/")[1];
            const filePath = `courses/${course.id}/banner.${fileExtension}`;

            console.log("Uploading file to:", filePath);
            const { data, error } = await this.storage.uploadFile(
                filePath,
                course_banner_img_file.buffer,
            );
            if (error) throw error;

            banner_url = this.storage.getPublicUrl(filePath);

            await this.courseDatabase.updateCourseBanner(course?.category_id, banner_url);

            return { ...course, banner_url };
        } catch (error) {
            console.error("Error in createCourse:", error);
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }
}

module.exports = CourseService;
