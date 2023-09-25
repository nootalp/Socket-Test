const WebSocket = require("ws");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
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
}

module.exports = WebSocketServer;
