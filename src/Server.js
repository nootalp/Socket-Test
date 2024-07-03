const ExpressServer = require("./utils/server/classExpressServer.js");
const {
  httpPort,
  webSocketURL,
  phpProxyURL,
} = require("./utils/configServer.js");
const Routes = require("./utils/server/classRoutes.js");
const WebSocket = require("ws");
const { exec } = require("child_process");
const { hostname, port } = new URL(phpProxyURL);

/** Setup local php server. */
exec(`php -S ${hostname}:${port} -t .`);
const ws = new WebSocket(`${webSocketURL}`);

new ExpressServer(httpPort, new Routes(ws).appRoutes);
