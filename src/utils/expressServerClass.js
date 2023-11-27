const express = require("express");
const http = require("http");
const WebSocketServer = require("./socketServerClass");
const { httpURI } = require("./configServer");

class ExpressServer {
  constructor(port, routes) {
    this.port = port;
    this.mainApp = express();
    this.server = http.createServer(this.mainApp);
    this.websocketServer = new WebSocketServer(this.server);

    this.setupRoutes(routes);
    this.startServer();
  }

  setupRoutes(routes) {
    this.mainApp.use("/", routes);
  }

  startServer() {
    this.server.listen(this.port, () =>
      console.log(`Server running on ${httpURI}`)
    );
  }
}

module.exports = ExpressServer;
