const ExpressServer = require("./utils/expressServerClass.js");
const { httpPort } = require("./utils/configServer.js");
const Routes = require("./utils/routes.js");
const { exec } = require("child_process");

/** Setup local php server. */
exec("php -S localhost:8000 -t public");

const webRoutes = new Routes();
new ExpressServer(httpPort, webRoutes.returnRoutes());
