const WebSocket = require("ws");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  async decodeMessage(blobMessage) {
    return new Promise((resolve, reject) => {
      try {
        const textMessage = Buffer.from(blobMessage).toString("utf-8");
        resolve(textMessage);
      } catch (err) {
        console.error("Error to process message: ", err);
        reject(err);
      }
    });
  }

  handleWebSocketConnection(ws, req) {
    const clientId = ws._socket.remoteAddress + ws._socket.remotePort;

    this.clients.set(clientId, {
      socket: ws,
      connectionTime: new Date(),
      userAgent: req.headers["user-agent"],
      clientIPAddress: req.socket.remoteAddress,
    });
    const { connectionTime, userAgent, clientIPAddress } =
      this.clients.get(clientId);

    console.log(
      `Client ${clientId}\nConnected at ${connectionTime}\nWith ${userAgent},\nIP: ${clientIPAddress}.`
    );

    ws.on("message", async (message) => {
      try {
        const textMessage = await this.decodeMessage(message);
        this.broadcastMessage(textMessage, ws);
      } catch (err) {
        console.error("Error: ", err);
      }
    });

    ws.on("close", () => {
      try {
        console.log(`Closing ${clientId} connection...`);
        this.clients.delete(clientId);
      } catch (err) {
        console.error(`Error closing client: ${err}`);
      }
    });

    ws.send(JSON.stringify({ connection: "ok" }), (error) => {
      if (error) {
        console.error("Error sending message to client: ", error);
      }
    });
  }

  broadcastMessage(message, sender) {
    Array.from(this.clients.values())
      .filter(
        (client) =>
          client.socket !== sender &&
          client.socket.readyState === WebSocket.OPEN
      )
      .forEach((client) => {
        client.socket.send(message, (error) => {
          if (error) {
            console.error("Error broadcasting message to client: ", error);
          }
        });
      });
  }
}

module.exports = WebSocketServer;
