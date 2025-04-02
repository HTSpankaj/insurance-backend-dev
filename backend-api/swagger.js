const swaggerAutogen = require("swagger-autogen")();

const docOptions = {
    info: {
        title: "Insurance Backend API's",
        description: "",
    },
    host: "",
    basePath: "/",
    schemes: ["http", "https"],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter your bearer token in the format **Bearer &lt;token&gt;**",
        },
    },
    security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-doc/swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, docOptions);
