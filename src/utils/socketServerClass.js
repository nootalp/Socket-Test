const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const { URI } = require("./configServer");

class SocketChatServer {
  constructor(port) {
    this.port = port;
    this.server = http.createServer(this.handleHttpRequest);
    this.wss = new WebSocket.Server({ server: this.server });
    this.clients = new Set();

    this.wss.on("connection", this.handleWebSocketConnection);
  }

  handleHttpRequest(_, res) {
    fs.readFile("public/index.html", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  handleWebSocketConnection(ws) {
    this.clients.add(ws);

    ws.on("message", (message) => {
      this.broadcastMessage(messageString, ws);
    });

    ws.on("close", () => this.clients.delete(ws));
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
