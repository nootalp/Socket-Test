const ExpressServer = require("./utils/expressServerClass.js");
const {
  httpPort,
  phpProxyURL,
  webSocketURL,
} = require("./utils/configServer.js");
const Routes = require("./utils/routes.js");
const WebSocket = require("ws");
const { exec } = require("child_process");

/** Setup local php server. */
exec(`php -S ${phpProxyURL} -t public`);
const ws = new WebSocket(`${webSocketURL}`);

new ExpressServer(httpPort, new Routes(ws).appRoutes);
