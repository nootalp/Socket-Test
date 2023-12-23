const ExpressServer = require("./utils/server/expressServerClass.js");
const {
  httpPort,
  webSocketURL,
  phpProxyURL,
} = require("./utils/configServer.js");
const Routes = require("./utils/server/routes.js");
const WebSocket = require("ws");
const { exec } = require("child_process");
const { hostname, port } = new URL(phpProxyURL);

/** Setup local php server. */
exec(`php -S ${hostname}:${port} -t public`);
const ws = new WebSocket(`${webSocketURL}`);

new ExpressServer(httpPort, new Routes(ws).appRoutes);
