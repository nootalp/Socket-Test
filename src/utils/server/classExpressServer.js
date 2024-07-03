const { httpURL, phpProxyURL } = require("../configServer");
const SocketServer = require("./classSocketServer");
const { createServer } = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

class ExpressServer { 
  constructor(port, routes) {
    this.port = port;
    this.mainApp = express();
    this.httpServer = createServer(this.mainApp);
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
          target: `${phpProxyURL}/public/chat.php`,
          changeOrigin: true,
          onProxyRes: (proxyRes, _, res) => {
            const cookies = proxyRes.headers["set-cookie"];
            if (cookies) {
              res.setHeader("Set-Cookie", cookies);
            }
          },
        })
      )
      .use(
        "/src/processData",
        express.static(path.join(process.cwd(), "src", "processData"), {
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
