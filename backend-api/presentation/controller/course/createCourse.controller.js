const { supabaseInstance } = require("../../../supabase-db/index.js");
const CourseService = require("../../../application/services/course/course.service.js");

const courseService = new CourseService(supabaseInstance);
const CourseModuleService = require("../../../application/services/course/courseModule.service.js");

const courseModuleService = new CourseModuleService(supabaseInstance);
exports.createCourseController = async (req, res) => {
    /*
    #swagger.tags = ['Course']
    #swagger.autoBody = false
    #swagger.description = 'Create a new course'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Course title' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Course description' }
    #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true, description: 'Category UUID' }
    #swagger.parameters['access_for_all_user'] = { in: 'formData', type: 'boolean', required: true, description: 'Access for all users' }
    #swagger.parameters['access_for_verified_user'] = { in: 'formData', type: 'boolean', required: true, description: 'Access for verified users' }
    #swagger.parameters['availability_schedule'] = { in: 'formData', type: 'string', required: true, enum: ['Immediate', 'Schedule'], description: 'Availability schedule' }
    #swagger.parameters['schedule_date'] = { in: 'formData', type: 'date', format: 'date', required: false, description: 'Scheduled release date' }
    #swagger.parameters['status'] = { in: 'formData', type: 'string', required: true, enum: ['Saved As Draft', 'Published', 'Archived'], description: 'Course status' }
    #swagger.parameters['course_banner_img_file'] = { in: 'formData', type: 'file', required: true, description: 'Course banner image (JPEG, PNG)' }
    */

    try {
        const {
            title,
            description,
            category_id,
            access_for_all_user,
            access_for_verified_user,
            availability_schedule,
            schedule_date,
            status,
        } = req.body;

        const course_banner_img_file = req.files?.course_banner_img_file?.[0] || null;

        const accessAllUsers = access_for_all_user === "true";
        const accessVerifiedUsers = access_for_verified_user === "true";

        const formattedScheduleDate = schedule_date ? new Date(schedule_date) : null;

        const result = await courseService.createCourse(
            title,
            description,
            category_id,
            accessAllUsers,
            accessVerifiedUsers,
            availability_schedule,
            formattedScheduleDate,
            status,
            course_banner_img_file,
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, error: { message: error.message } });
    }
};

