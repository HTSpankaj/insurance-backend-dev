const express = require("express");

const {
    addCourseModuleController,
    getCourseModulesController,
} = require("../../../presentation/controller/course/coursemodule.controller");
const uploadSingle = require("../../../middleware/multer.coursemodule");
const router = express.Router();

router.post("/add-course-module", uploadSingle, addCourseModuleController);
router.get("/course-module-list/:course_id", getCourseModulesController);

module.exports = router;
