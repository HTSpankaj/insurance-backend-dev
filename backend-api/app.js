var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var winstonLogger = require("./logger/index");
const cors = require("cors");

var indexRouter = require("./routes/index");

const dynamicCors = require("./configs/cors.config");

// Schedule job
require("./scheduler/invoice/invoiceCreation.scheduler");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV?.trim() || process.env.NODE_ENV?.trim() === "development") {
    console.log("Run with disable cors.");
    app.use(cors());
} else {
    console.log("Run with enable cors.");
    app.use(cors(dynamicCors));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development

    if (err?.message?.startsWith("multerError:")) {
        return res.status(402).json({
            success: false,
            isParameterError: true,
            error: { message: err?.message || err },
        });
    }

    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.error(err);

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Uncaught exception handler
process.on("uncaughtException", error => {
    winstonLogger.error("Uncaught exception :", error);
    process.exit(1);
});

// Unhandle rejection handler
process.on("unhandledRejection", (reason, promise) => {
    winstonLogger.error("Unhandled Rejection: ", reason);
    process.exit(1);
});

module.exports = app;
