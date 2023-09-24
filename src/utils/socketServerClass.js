const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const { URI } = require("./configServer");

class SocketChatServer {
  constructor(port) {
    this.port = port;
    this.server = http.createServer(this.handleHttpRequest.bind(this));
    this.wss = new WebSocket.Server({ server: this.server });
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
    this.clients = new Set();
  }

  handleHttpRequest(req, res) {
    if (req.url === "/chatHandler.js") {
      this.serveJavaScriptFile(req, res);
    } else {
      fs.readFile("public/index.html", (err, data) => {
        if (err) {
          res
            .writeHead(404, { "Content-Type": "text/html" })
            .end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" }).end(data);
        }
      });
    }
  }

  serveJavaScriptFile(req, res) {
    fs.readFile("public/chatHandler.js", (err, data) => {
      if (err) {
        res
          .writeHead(404, { "Content-Type": "text/html" })
          .end("404 Not Found");
      } else {
        res
          .writeHead(200, { "Content-Type": "application/javascript" })
          .end(data);
      }
    });
  }

  handleWebSocketConnection(ws) {
    this.clients.add(ws);
    ws.on("message", (message) => {
      this.broadcastMessage(message, ws);
    }).on("close", () => this.clients.delete(ws));

    ws.send(JSON.stringify({ connection: "ok" }));
  }

  broadcastMessage(message, sender) {
    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  init() {
    this.server.listen(this.port, () =>
      console.log(`Server running on ${URI}`)
    );
  }
}

module.exports = SocketChatServer;
