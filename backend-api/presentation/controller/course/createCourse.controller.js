const { supabaseInstance } = require("../../../supabase-db/index.js");
const CourseService = require("../../../application/services/course/course.service.js");

const courseService = new CourseService(supabaseInstance);

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
    #swagger.parameters['schedule_date'] = { in: 'formData', type: 'string', required: false, description: 'Scheduled release date (YYYY-MM-DD)' }
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
        console.log("course_banner_img_file:", course_banner_img_file?.originalname);

        // Validation
        if (!title || typeof title !== "string" || title.trim().length < 1)
            throw new Error("Title is required");
        if (!description || typeof description !== "string")
            throw new Error("Description is required");
        if (
            !category_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                category_id,
            )
        ) {
            throw new Error("Category ID must be a valid UUID");
        }
        const accessAllUsers = access_for_all_user === "true";
        const accessVerifiedUsers = access_for_verified_user === "true";
        if (!["Immediate", "Schedule"].includes(availability_schedule))
            throw new Error("Invalid availability schedule");
        const formattedScheduleDate = schedule_date ? new Date(schedule_date) : null;
        if (schedule_date && isNaN(formattedScheduleDate.getTime()))
            throw new Error("Invalid schedule date");
        if (!["Saved As Draft", "Published", "Archived"].includes(status))
            throw new Error("Invalid status");
        if (!course_banner_img_file) throw new Error("Course banner image is required");

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
        console.error("Error in createCourseController:", error);
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong" } });
    }
};

exports.updateCourseController = async (req, res) => {
    /*
    #swagger.tags = ['Course']
    #swagger.autoBody = false
    #swagger.description = 'Create a new course'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['id'] = { in: 'formData', type: 'string', required: true, description: 'course UUID' }
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Course title' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Course description' }
    #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true, description: 'Category UUID' }
    #swagger.parameters['access_for_all_user'] = { in: 'formData', type: 'boolean', required: true, description: 'Access for all users' }
    #swagger.parameters['access_for_verified_user'] = { in: 'formData', type: 'boolean', required: true, description: 'Access for verified users' }
    #swagger.parameters['availability_schedule'] = { in: 'formData', type: 'string', required: true, enum: ['Immediate', 'Schedule'], description: 'Availability schedule' }
    #swagger.parameters['schedule_date'] = { in: 'formData', type: 'string', required: false, description: 'Scheduled release date (YYYY-MM-DD)' }
    #swagger.parameters['status'] = { in: 'formData', type: 'string', required: true, enum: ['Saved As Draft', 'Published', 'Archived'], description: 'Course status' }
    #swagger.parameters['course_banner_img_file'] = { in: 'formData', type: 'file', required: false, description: 'Course banner image (JPEG, PNG)' }
    */
    try {
        const {
            id,
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

        // Validation
        if (
            !id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                id,
            )
        ) {
            throw new Error("Course ID must be a valid UUID");
        }
        if (!title || typeof title !== "string" || title.trim().length < 1)
            throw new Error("Title is required");
        if (!description || typeof description !== "string")
            throw new Error("Description is required");
        if (
            !category_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                category_id,
            )
        ) {
            throw new Error("Category ID must be a valid UUID");
        }
        const accessAllUsers = access_for_all_user === "true";
        const accessVerifiedUsers = access_for_verified_user === "true";
        if (!["Immediate", "Schedule"].includes(availability_schedule))
            throw new Error("Invalid availability schedule");
        const formattedScheduleDate = schedule_date ? new Date(schedule_date) : null;
        if (schedule_date && isNaN(formattedScheduleDate.getTime()))
            throw new Error("Invalid schedule date");
        if (!["Saved As Draft", "Published", "Archived"].includes(status))
            throw new Error("Invalid status");

        const result = await courseService.updateCourse(
            id,
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
        console.error("Error in updateCourseController:", error);
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong" } });
    }
};

exports.deleteCourseController = async (req, res) => {
    /*
    #swagger.tags = ['Course']
    #swagger.description = 'Delete Course.'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "id": "",
        }
    }
  */
    try {
        const { id } = req.body;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !uuidRegex.test(id)) {
            throw new Error("Course ID must be a valid UUID");
        }

        const result = await courseService.deleteCourse(id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in deleteCourseController:", error);
        if (error.message === "Unauthorized") {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized" },
            });
        }
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getCourseListController = async (req, res) => {
    /*
    #swagger.tags = ['Course']
    #swagger.description = 'Get a paginated list of courses with optional filters'
    #swagger.method = 'get'
    #swagger.parameters['page_number'] = { in: 'query', type: 'integer', required: false, description: 'Page number (default: 1)', example: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, description: 'Number of courses per page (default: 10)', example: 10 }
    #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, description: 'Filter by course status', enum: ['', 'Saved As Draft', 'Published', 'Archived'], example: 'Published' }
    #swagger.parameters['category_id'] = { in: 'query', type: 'string', required: false, description: 'Filter by category UUID', example: '4236213c-4b43-4c80-b1fb-dc40aaee1f50' }
    #swagger.parameters['search'] = { in: 'query', type: 'string', required: false, description: 'Search term for course title', example: 'backend' }
    #swagger.responses[200] = {
        description: 'Course list retrieved successfully',
        schema: { success: true, data: { type: 'array' }, metadata: { page: 'integer', per_page: 'integer', total_count: 'integer', total_pages: 'integer' } }
    }
    #swagger.responses[400] = {
        description: 'Invalid input',
        schema: { success: false, error: { message: 'string' } }
    }
    */
    try {
        const {
            page_number = 1,
            limit = 10,
            status = "",
            category_id = "",
            search = "",
        } = req.query;

        const pageNumber = parseInt(page_number, 10);
        const pageLimit = parseInt(limit, 10);
        if (isNaN(pageNumber) || pageNumber < 1) {
            throw new Error("Page number must be a positive integer");
        }
        if (isNaN(pageLimit) || pageLimit < 1) {
            throw new Error("Limit must be a positive integer");
        }
        if (status && !["", "Saved As Draft", "Published", "Archived"].includes(status)) {
            throw new Error("Status must be one of: '', 'Saved As Draft', 'Published', 'Archived'");
        }
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (category_id && category_id !== "" && !uuidRegex.test(category_id)) {
            throw new Error("Category ID must be a valid UUID");
        }

        const { courses, totalCount } = await courseService.getCourseList({
            pageNumber,
            limit: pageLimit,
            status,
            categoryId: category_id,
            search,
        });

        const totalPages = Math.ceil(totalCount / pageLimit);

        return res.status(200).json({
            success: true,
            data: courses,
            metadata: {
                page: pageNumber,
                per_page: pageLimit,
                total_count: totalCount,
                total_pages: totalPages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
