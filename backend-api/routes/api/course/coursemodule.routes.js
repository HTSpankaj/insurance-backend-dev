const express = require("express");

const {
    addCourseModuleController,
    updateCourseModuleController,
    getCourseModulesController,
} = require("../../../presentation/controller/course/coursemodule.controller");
const uploadSingle = require("../../../middleware/multer.coursemodule");
const router = express.Router();

router.post("/add-course-module", uploadSingle, addCourseModuleController);
router.put("/update-course-module", uploadSingle, updateCourseModuleController);
router.get("/course-module-list/:course_id", getCourseModulesController);

module.exports = router;
