const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as buffer

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("multerError:Invalid file type"), false);
    }
};

// Multer configuration for handling multiple files
const uploadCourseFiles = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
    { name: "course_banner_img_file", maxCount: 1 }, // Image file for course banner
    // { name: "logo_file", maxCount: 1 } // Another optional file field
]);

module.exports = uploadCourseFiles;
