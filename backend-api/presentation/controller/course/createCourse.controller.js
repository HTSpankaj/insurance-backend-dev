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
    #swagger.parameters['course_banner_img_url'] = { in: 'formData', type: 'file', required: true, description: 'Course banner image (JPEG, PNG)' }
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

        const course_banner_img_file = req.files?.course_banner_img_url?.[0] || null;

        console.log("course_banner_img_file", course_banner_img_file?.originalname);

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

        console.log("Result:", result);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in createCourseController:", error);
        return res.status(400).json({ success: false, error: { message: error.message } });
    }
};

exports.addCourseModuleController = async (req, res) => {
    /*
    #swagger.tags = ['Course Module']
    #swagger.autoBody = false
    #swagger.description = 'Add a new course module'
    #swagger.consumes = ['multipart/form-data']
    
    #swagger.parameters['title'] = { 
        in: 'formData', 
        type: 'string', 
        required: true, 
        description: 'Module title' 
    }
    #swagger.parameters['file_type'] = { 
        in: 'formData', 
        type: 'string', 
        required: true, 
        enum: ['Video', 'PDF', 'Image', 'Text'], 
        description: 'Type of file for the module' 
    }
    #swagger.parameters['course_id'] = { 
        in: 'formData', 
        type: 'string', 
        format: 'uuid', 
        required: true, 
        description: 'UUID of the course this module belongs to' 
    }
    #swagger.parameters['content'] = { 
        in: 'formData', 
        type: 'string', 
        required: false, 
        description: 'Optional description/content of the module' 
    }
    #swagger.parameters['file'] = { 
        in: 'formData', 
        type: 'file', 
        required: false, 
        description: 'Optional file to upload (PDF, Video, Image, etc.)' 
    }

    #swagger.responses[200] = { 
        description: 'Module created successfully', 
        schema: { 
            success: true, 
            data: { 
                id: "12345", 
                title: "Module 1", 
                file_type: "PDF", 
                course_id: "163ec092-6b68-486e-83a8-a66b119cbc06", 
                content: "This is a module description", 
                file_url: "https://supabase.storage.com/bucket/modules/12345/file.pdf" 
            } 
        } 
    }

    #swagger.responses[400] = { 
        description: 'Bad request - missing required fields or other errors', 
        schema: { 
            success: false, 
            error: { 
                message: "Missing required fields" 
            } 
        } 
    }
    */

    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { title, file_type, course_id, content } = req.body;
        const file = req.file || null;

        if (!title || !file_type || !course_id) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        // Call service function to handle logic
        const result = await courseModuleService.addCourseModule(
            title,
            file_type,
            course_id,
            content,
            file,
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in addCourseModuleController:", error);
        return res.status(400).json({ success: false, error: { message: error.message } });
    }
};
