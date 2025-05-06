const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as buffer

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/", "video/", "application/pdf"];
    if (allowedMimeTypes.some(s => file.mimetype?.startsWith(s))) {
        cb(null, true);
    } else {
        cb(new Error("multerError:Invalid file type"), false);
    }
};

const ImageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/"];
    if (allowedMimeTypes.some(s => file.mimetype?.startsWith(s))) {
        cb(null, true);
    } else {
        cb(new Error("multerError:Invalid file type"), false);
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

const uploadInvoiceTemplateGenerationLogoMulter = multer({
    storage,
    ImageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).fields([
    { name: "file", maxCount: 1 }, // Image file for course banner
    // { name: "logo_file", maxCount: 1 } // Another optional file field
]);

module.exports = { mobileBannerMulter, uploadInvoiceTemplateGenerationLogoMulter };
