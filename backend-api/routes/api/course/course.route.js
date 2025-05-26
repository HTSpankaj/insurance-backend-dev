const express = require("express");
const {
    createCourseController,
    deleteCourseController,
    getCourseListController,
    getCourseDetailsController,
    updateCourseController,
} = require("../../../presentation/controller/course/createCourse.controller");
const uploadCourseBanner = require("../../../middleware/course.middleware");
const {
    createCourseValidator,
    updateCourseValidator,
} = require("../../../validator/course/course.validator");

const router = express.Router();

router.post("/create-course", uploadCourseBanner, createCourseValidator, createCourseController);
router.put("/update-course", uploadCourseBanner, updateCourseValidator, updateCourseController);
// router.post("/create-course", uploadCourseBanner, createCourseController);
router.delete("/delete-course", deleteCourseController);
router.get("/course-list", getCourseListController);
router.get("/course-details/:id", getCourseDetailsController);

module.exports = router;
