const CourseModuleDatabase = require("../../../infrastructure/databases/course/courseModule.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class CourseModuleService {
    constructor(supabaseInstance) {
        this.courseModuleDatabase = new CourseModuleDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "courses"); // Bucket named 'course-modules'
    }
}

module.exports = CourseModuleService;
