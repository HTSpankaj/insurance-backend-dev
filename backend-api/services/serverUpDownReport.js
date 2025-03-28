var config = require("../configs/env.config")

function serverUp(port) {
    console.log(`Server Up On: PORT:${port} || Time => [${new Date().toLocaleString()}]`);
}

module.exports = {
    serverUp
}
