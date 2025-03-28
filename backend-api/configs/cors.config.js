const { whitelists } = require("./env.config");

const dynamicCors = function (req, callback) {
    console.log("CORS request from origin:", req.headers.origin);

    let corsOptions;
    const origin = req.headers.origin;

    if (whitelists.indexOf(origin) !== -1 || (!origin && origin !== undefined)) {
        corsOptions = {
            // Allow credentials for CORS requests

            origin: true,
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders:
                "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept",
        };
    } else {
        corsOptions = { origin: false };
        console.error("Access Denied for origin:", origin);
        callback(new Error("Access Denied"), corsOptions);
    }
    callback(null, corsOptions);
};

module.exports = dynamicCors;
