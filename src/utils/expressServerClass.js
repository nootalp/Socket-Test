const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const WebSocketServer = require("./socketServerClass");
const { httpURI, __projectDirectory } = require("./configServer");
const path = require("path");

class ExpressServer {
  constructor(port, routes) {
    this.port = port;
    this.mainApp = express();
    this.server = http.createServer(this.mainApp);
    this.websocketServer = new WebSocketServer(this.server);

    this.expressConfig();
    this.setupRoutes(routes);
    this.startServer();
  }

  expressConfig() {
    this.mainApp
      .use(bodyParser.urlencoded({ extended: true }))
      .use(
        "/public/chat.php",
        createProxyMiddleware({
          target: "http://localhost:8000",
          changeOrigin: true,
          pathRewrite: {
            "^/public/chat.php": "chat.php",
          },
        })
      )
      .use(
        "/public",
        express.static(path.join(__projectDirectory, "public"), {
          "Content-Type": "text/javascript",
        })
      )
      .use(
        "/src/processData",
        express.static(path.join(__projectDirectory, "src", "processData"), {
          "Content-Type": "text/javascript",
        })
      );
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
