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

        const course_banner_img_file = req.files?.course_banner_img_url?.[0] || null;
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
            .status(400)
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
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
