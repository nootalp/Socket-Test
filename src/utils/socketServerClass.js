const WebSocket = require("ws");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    /** Ensures that the event callback references the scope of the class with 'bind()'. */
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  getClientId(ws) {
    return ws._socket.remoteAddress + ws._socket.remotePort;
  }

  handleWebSocketConnection(ws, req) {
    const clientId = this.getClientId(ws);
    if (this.addClient(clientId, ws, req)) {
      this.sendConnectionmessage(ws);
    }

    ws.on("message", async (message) => {
      try {
        const textMessage = await this.decodeMessage(message);
        this.broadcastMessage(textMessage, ws);
      } catch (err) {
        console.error("Error decoding message: ", err);
      }
    });

    ws.on("close", () => {
      this.removeClient(clientId);
    });
  }

  sendConnectionmessage(ws) {
    const jsonMessage = JSON.stringify({ connection: "ok" });
    ws.send(jsonMessage, (error) => {
      if (error) {
        console.error("Error sending message to client: ", error);
      }
    });
  }

  removeClient(clientId) {
    this.clients.delete(clientId);
    console.log(`Closing connection for client ${clientId}`);
  }

  addClient(connectionInfo, ws, req) {
    try {
      this.clients.set(connectionInfo, {
        socket: ws,
        connectionTime: new Date(),
        userAgent: req.headers["user-agent"],
        clientIPAddress: req.socket.remoteAddress,
      });

      const { connectionTime, userAgent, clientIPAddress } =
        this.clients.get(connectionInfo);

      console.log(
        `${connectionInfo}\n${connectionTime}\n${userAgent}\n${clientIPAddress}`
      );

      return true;
    } catch (err) {
      console.log("Error to add client: ", err);
      return false;
    }
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
