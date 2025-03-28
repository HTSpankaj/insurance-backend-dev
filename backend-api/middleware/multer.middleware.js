const multer = require("multer");

const storage = multer.memoryStorage();

// Define allowed mime types for each field
const allowedTypes = {
    aadhar_card_file: mimetype => ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    pan_card_file: mimetype => ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    logo_file: mimetype => ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    irdai_license_file: mimetype =>
        ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    terms_of_agreement_file: mimetype =>
        ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    business_certification_file: mimetype =>
        ["application/pdf", "image/jpeg", "image/png"].includes(mimetype),
    product_brochure_url: mimetype => mimetype === "application/pdf",
    promotional_video_url: mimetype => mimetype.startsWith("video/"),
    promotional_image_url: mimetype => mimetype.startsWith("image/"),
};

// File filter to validate file types based on field names
const fileFilter = (req, file, cb) => {
    const fieldName = file.fieldname;
    if (!allowedTypes[fieldName]) {
        cb(new Error(`Unknown field ${fieldName}`), false);
    } else if (allowedTypes[fieldName](file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${fieldName}`), false);
    }
};

// Configure Multer with combined fields and a 10MB limit
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).fields([
    { name: "aadhar_card_file", maxCount: 1 },
    { name: "pan_card_file", maxCount: 1 },
    { name: "logo_file", maxCount: 1 },
    { name: "irdai_license_file", maxCount: 1 },
    { name: "terms_of_agreement_file", maxCount: 1 },
    { name: "business_certification_file", maxCount: 1 },
    { name: "product_brochure_url", maxCount: 1 },
    { name: "promotional_video_url", maxCount: 1 },
    { name: "promotional_image_url", maxCount: 1 },
]);

module.exports = upload;
