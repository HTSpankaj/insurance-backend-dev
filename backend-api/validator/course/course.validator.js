const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const createCourseValidator = [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").isString().notEmpty().withMessage("Description is required"),
    body("category_id").isUUID().withMessage("category_id must be a valid UUID"),
    body("access_for_all_user").isBoolean().withMessage("access_for_all_user must be a boolean"),
    body("access_for_verified_user")
        .isBoolean()
        .withMessage("access_for_verified_user must be a boolean"),
    body("availability_schedule")
        .isIn(["Immediate", "Schedule"])
        .withMessage('availability_schedule must be either "Immediate" or "Schedule"'),
    body("schedule_date")
        .optional()
        .custom((value, { req }) => {
            if (req.body.availability_schedule === "Schedule" && !value) {
                throw new Error(
                    "schedule_date is required when availability_schedule is 'Schedule'",
                );
            }
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error("schedule_date must be in YYYY-MM-DD format");
            }
            return true;
        }),

    body("status")
        .isIn(["Saved As Draft", "Published", "Archived"])
        .withMessage('status must be either "Saved As Draft", "Published", or "Archived"'),

    validateClientParametersAndSendResponse,
];

module.exports = { createCourseValidator };
