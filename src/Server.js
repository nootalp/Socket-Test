const ExpressServer = require("./utils/expressServerClass.js");
const { httpPort } = require("./utils/configServer.js");
const webRoutes = require("./utils/routes.js");

new ExpressServer(httpPort, webRoutes);
