const ExpressServer = require("./utils/expressServerClass.js");
const { httpPort } = require("./utils/configServer.js");
const Routes = require("./utils/routes.js");
const WebSocket = require("ws");
const { exec } = require("child_process");

/** Setup local php server. */
exec("php -S localhost:8000 -t public");
const ws = new WebSocket("ws://localhost:3000/");

new ExpressServer(httpPort, new Routes(ws).appRoutes);
