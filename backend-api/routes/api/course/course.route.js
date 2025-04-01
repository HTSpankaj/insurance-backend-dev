const express = require("express");
const {
    createCourseController,
    addCourseModuleController,
} = require("../../../presentation/controller/course/createCourse.controller");
const uploadCourseBanner = require("../../../middleware/course.middleware");
const router = express.Router();

router.post("/create-course", uploadCourseBanner, createCourseController);
router.post("/add-course-module", uploadCourseBanner, addCourseModuleController);

module.exports = router;
