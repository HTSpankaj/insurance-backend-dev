const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as buffer

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/", "video/", "application/pdf"];
    if (allowedMimeTypes.some(s => file.mimetype?.startsWith(s))) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

// Multer configuration for handling multiple files
const mobileBannerMulter = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
    { name: "file", maxCount: 1 }, // Image file for course banner
    // { name: "logo_file", maxCount: 1 } // Another optional file field
]);

module.exports = { mobileBannerMulter };
