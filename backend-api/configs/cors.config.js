const { whitelists } = require("./env.config");

const dynamicCors = function (req, callback) {
    const origin = req.headers.origin;
    console.log("CORS request from origin:", origin);

    if (!origin || whitelists.includes(origin)) {
        // Allow credentials for whitelisted origins or no-origin (like curl or internal server)
        callback(null, {
            origin: true,
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders:
                "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept",
        });
    } else {
        console.error("Access Denied for origin:", origin);
        callback(new Error("Not allowed by CORS"));
    }
};

module.exports = dynamicCors;
