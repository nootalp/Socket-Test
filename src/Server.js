const ExpressServer = require("./utils/expressServerClass.js");
const { httpPort } = require("./utils/configServer.js");
const Routes = require("./utils/routes.js");
const { exec } = require("child_process");
const WebSocketServer = require("./utils/socketServerClass.js");

/** Setup local php server. */
exec("php -S localhost:8000 -t public");

const webRoutes = new Routes().returnRoutes();
new ExpressServer(httpPort, webRoutes);
