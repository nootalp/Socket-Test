const WebSocket = require("ws");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  async decodeMessage(blobMessage) {
    return new Promise((resolve) => {
      const textMessage = Buffer.from(blobMessage).toString("utf-8");
      resolve(textMessage);
    });
  }

  handleWebSocketConnection(ws) {
    this.clients.add(ws);
    ws.on("message", async (message) => {
      const textMessage = await this.decodeMessage(message);
      this.broadcastMessage(textMessage, ws);
    });

    ws.on("close", () => {
      this.clients.delete(ws);
    });
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
