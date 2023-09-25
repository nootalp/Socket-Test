const express = require("express");
const http = require("http");
const WebSocketServer = require("./socketServerClass");
const { httpURI, __projectDirectory } = require("./configServer");
const path = require("path");

class ExpressServer {
  constructor(port) {
    this.port = port;
    this.webApp = express();
    this.server = http.createServer(this.webApp);
    this.websocketServer = new WebSocketServer(this.server);

    /** Routes. */
    this.webApp
      .get("/", (_, res) =>
        res.sendFile(path.join(__projectDirectory, "public", "index.html"))
      )
      .use(
        "/public",
        express.static(path.join(__projectDirectory, "public"), {
          "Content-Type": "text/javascript",
        })
      );

    this.server.listen(this.port, () =>
      console.log(`Server running on ${httpURI}`)
    );
  }
}

module.exports = ExpressServer;
