const multer = require("multer");

const storage = multer.memoryStorage();

// Define allowed mime types for the 'file' field based on file_type
const allowedTypes = {
    file: (mimetype, fileType) => {
        const typeMap = {
            Video: ["video/mp4"],
            PDF: ["application/pdf"],
            Image: ["image/jpeg", "image/png"],
            Text: ["text/plain"],
        };
        return typeMap[fileType]?.includes(mimetype) || false;
    },
};

// File filter to validate file type based on the provided file_type in req.body
const fileFilter = (req, file, cb) => {
    const fieldName = file.fieldname;
    const fileType = req.body.file_type;

    if (fieldName !== "file") {
        return cb(new Error(`Unexpected field ${fieldName}`), false);
    }

    if (!fileType || !["Video", "PDF", "Image", "Text"].includes(fileType)) {
        return cb(new Error("file_type must be one of: Video, PDF, Image, Text"), false);
    }

    if (allowedTypes[fieldName](file.mimetype, fileType)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for file_type: ${fileType}`), false);
    }
};

// Configure Multer with the 'file' field and a 10MB limit
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");

module.exports = upload;
