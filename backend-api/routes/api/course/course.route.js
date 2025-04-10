const express = require("express");
const {
    createCourseController,
    deleteCourseController,
    getCourseListController,
} = require("../../../presentation/controller/course/createCourse.controller");
const uploadCourseBanner = require("../../../middleware/course.middleware");
const { createCourseValidator } = require("../../../validator/course/course.validator");

const router = express.Router();

router.post("/create-course", uploadCourseBanner, createCourseValidator, createCourseController);
// router.post("/create-course", uploadCourseBanner, createCourseController);
router.delete("/delete-course", deleteCourseController);
router.get("/course-list", getCourseListController);

module.exports = router;
