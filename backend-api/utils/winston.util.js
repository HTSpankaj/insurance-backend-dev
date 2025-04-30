const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const { createLogger, format, transports } = require("winston");

const logsDir = path.join(__dirname, "../logs");

if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
}

function getWinstonLogger(fileName = "default", isShowLabel = false) {
    return createLogger({
        level: "info",
        format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.label({ label: fileName }),
            format.printf(({ timestamp, level, message, label }) => {
                if (typeof message === "string") {
                    return `[${timestamp}] ${isShowLabel ? `[${label}] ` : ""} ${level.toUpperCase()}: ${message}`;
                } else {
                    return `[${timestamp}] ${isShowLabel ? `[${label}] ` : ""} ${level.toUpperCase()}: \n ${JSON.stringify(message, null, 2)}`;
                }
            }),
        ),
        transports: [
            new transports.File({
                filename: path.join(logsDir, `${fileName}.log`),
                level: "info",
            }),
            new transports.Console(),
        ],
    });
}

module.exports = { getWinstonLogger };

//! Example logging methods in action
// logger.info("Invoice scheduler started.");
// logger.warn("Potential issue detected with date format.");
// logger.error("Failed to fetch records from Supabase.");
// logger.debug("Fetching data from the database: page 1 of 10.");
// logger.verbose("Validating input data for invoice creation.");
// logger.silly("Entering function: createInvoiceSchedularLogic.");
// logger.http("HTTP request to /api/invoice scheduled for execution.");
