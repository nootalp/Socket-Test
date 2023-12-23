const express = require("express");
const http = require("http");
const SocketServer = require("./socketServerClass");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { httpURL, __projectDirectory, phpProxyURL } = require("../configServer");

class ExpressServer {
  constructor(port, routes) {
    this.port = port;
    this.mainApp = express();
    this.httpServer = http.createServer(this.mainApp);
    this.socketServer = new SocketServer(this.httpServer);

    this.expressConfig();
    this.setupRoutes(routes);
    this.startServer();
  }

  expressConfig() {
    this.mainApp
      .use(bodyParser.urlencoded({ extended: true }))
      .use(cookieParser())
      .use(
        "/public/chat.php",
        createProxyMiddleware({
          target: `${phpProxyURL}/chat.php`,
          changeOrigin: true,
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
    this.httpServer.listen(this.port, () =>
      console.log(`Server running on ${httpURL}`)
    );
  }
}

module.exports = ExpressServer;
