const express = require("express");
const {
    createCourseController
} = require("../../../presentation/controller/course/createCourse.controller");
const uploadCourseBanner = require("../../../middleware/course.middleware");
const { createCourseValidator } = require("../../../validator/course/course.validator");

const router = express.Router();

router.post("/create-course", uploadCourseBanner, createCourseValidator, createCourseController);

module.exports = router;
