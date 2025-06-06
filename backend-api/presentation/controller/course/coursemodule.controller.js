const { supabaseInstance } = require("../../../supabase-db/index.js");
const CourseService = require("../../../application/services/course/courseModule.service.js");

const courseService = new CourseService(supabaseInstance);

exports.addCourseModuleController = async (req, res) => {
    /*
    #swagger.tags = ['Course_Module ']
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
        enum: ['Video', 'PDF', 'Image', 'Text', 'URL'], 
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
    */
    try {
        const { title, file_type, course_id, content } = req.body;
        const file = req.file; // Should be populated by Multer
        console.log("Controller - Received file:", file); // Debug log

        // Validation
        if (!title || typeof title !== "string" || title.trim().length < 1) {
            throw new Error("Title must be a non-empty string");
        }
        if (!file_type || !["Video", "PDF", "Image", "Text", "URL"].includes(file_type)) {
            throw new Error("File type must be one of: Video, PDF, Image, Text");
        }
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!course_id || !uuidRegex.test(course_id)) {
            throw new Error("Course ID must be a valid UUID");
        }
        if (content && (typeof content !== "string" || content.trim().length < 1)) {
            throw new Error("Content must be a non-empty string if provided");
        }

        const result = await courseService.addCourseModule(
            title,
            file_type,
            course_id,
            content || null,
            file,
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.updateCourseModuleController = async (req, res) => {
    /*
    #swagger.tags = ['Course_Module ']
    #swagger.autoBody = false
    #swagger.description = 'Update a course module'
    #swagger.consumes = ['multipart/form-data']
    
    #swagger.parameters['id'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'ID of the module'
    }
    #swagger.parameters['title'] = { 
        in: 'formData', 
        type: 'string', 
        required: false, 
        description: 'Module title' 
    }
    #swagger.parameters['file_type'] = { 
        in: 'formData', 
        type: 'string', 
        required: false, 
        enum: ['Video', 'PDF', 'Image', 'Text', 'URL'], 
        description: 'Type of file for the module' 
    }
    #swagger.parameters['content'] = { 
        in: 'formData', 
        type: 'string', 
        required: false, 
        description: 'Optional description/content of the module' 
    }
    #swagger.parameters['is_active'] = {
        in: 'formData',
        type: 'boolean',
        required: false,
        description: 'Optional boolean to set the module active or inactive'
    }
    #swagger.parameters['is_delete'] = {
        in: 'formData',
        type: 'boolean',
        required: false,
        description: 'Optional boolean to delete the module'
    }
    #swagger.parameters['file'] = { 
        in: 'formData', 
        type: 'file', 
        required: false, 
        description: 'Optional file to upload (PDF, Video, Image, etc.)' 
    }
    */
    try {
        const { id, title, file_type, content, is_active, is_delete } = req.body;
        const file = req.file; // Should be populated by Multer
        // console.log("Controller - Received file:", file); // Debug log

        // Validation
        if (!title || typeof title !== "string" || title.trim().length < 1) {
            throw new Error("Title must be a non-empty string");
        }
        if (!file_type || !["Video", "PDF", "Image", "Text", "URL"].includes(file_type)) {
            throw new Error("File type must be one of: Video, PDF, Image, Text");
        }
        if (content && (typeof content !== "string" || content.trim().length < 1)) {
            throw new Error("Content must be a non-empty string if provided");
        }

        const result = await courseService.updateCourseModule(
            id,
            title,
            file_type,
            content || null,
            is_active,
            is_delete,
            file,
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getCourseModulesController = async (req, res) => {
    /*
    #swagger.tags = ['Course_Module ']
    #swagger.description = 'Get list of course modules for a specific course'
    #swagger.method = 'get'
    #swagger.path = '/course-module-list/{course_id}'
    #swagger.parameters['course_id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: 'UUID of the course',
        example: '837b8747-e7fe-4e40-9a00-dcd07e4a800d'
    }
    #swagger.responses[200] = {
        description: 'Course modules retrieved successfully',
        schema: {
            success: true,
            data: []
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid course ID',
        schema: {
            success: false,
            error: { message: 'Course ID must be a valid UUID' }
        }
    }
    */
    try {
        const { course_id } = req.params;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!course_id || !uuidRegex.test(course_id)) {
            throw new Error("Course ID must be a valid UUID");
        }

        const modules = await courseService.getCourseModules(course_id);

        return res.status(200).json({
            success: true,
            data: modules,
        });
    } catch (error) {
        console.error("Error in getCourseModulesController:", error);
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
