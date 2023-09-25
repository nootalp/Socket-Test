const ExpressServer = require("./utils/expressServerClass.js");
const { httpPort } = require("./utils/configServer.js");

new ExpressServer(httpPort);
